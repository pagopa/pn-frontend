import {
  GetNotificationsParams,
  GetNotificationsResponse,
  RecipientNotification,
  formatFiscalCode,
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  parseError,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  NotificationReceivedApiFactory,
  SearchReceivedNotificationsV1CommunicationTypeEnum,
} from '../../generated-client/notifications';

export enum DASHBOARD_ACTIONS {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

/**
 * Get received notifications
 */
export const getReceivedNotifications = createAsyncThunk(
  DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS,
  async (params: GetNotificationsParams, { rejectWithValue }) => {
    try {
      const receivedNotificationsFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const startDate = params.startDate || tenYearsAgo;
      const endDate = params.endDate || today;
      const apiParams = {
        ...params,
        startDate: formatToTimezoneString(getStartOfDay(startDate)),
        endDate: formatToTimezoneString(getEndOfDay(endDate)),
        recipientId: params.recipientId ? formatFiscalCode(params.recipientId) : undefined,
        iunMatch: params.iunMatch || undefined,
      };
      const response = await receivedNotificationsFactory.searchReceivedNotificationsV1(
        apiParams.startDate,
        apiParams.endDate,
        apiParams.mandateId,
        apiParams.recipientId,
        apiParams.subjectRegExp,
        apiParams.iunMatch,
        apiParams.size,
        apiParams.nextPagesKey,
        SearchReceivedNotificationsV1CommunicationTypeEnum.All
      );
      return response.data as GetNotificationsResponse<RecipientNotification>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);
