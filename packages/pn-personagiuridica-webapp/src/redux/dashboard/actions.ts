import {
  GetNotificationsParams,
  GetNotificationsResponse,
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
  NotificationStatusV26,
} from '../../generated-client/notifications';

export enum DASHBOARD_ACTIONS {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

/**
 * Get received notifications
 */
export const getReceivedNotifications = createAsyncThunk(
  DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS,
  async (params: GetNotificationsParams & { isDelegatedPage: boolean }, { rejectWithValue }) => {
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
        status: params.status as NotificationStatusV26 | undefined,
        iunMatch: params.iunMatch || undefined,
      };
      const response = params.isDelegatedPage
        ? await receivedNotificationsFactory.searchReceivedDelegatedNotificationsV1(
            apiParams.startDate,
            apiParams.endDate,
            apiParams.mandateId,
            apiParams.recipientId,
            apiParams.group,
            apiParams.status,
            apiParams.iunMatch,
            apiParams.size,
            apiParams.nextPagesKey
          )
        : await receivedNotificationsFactory.searchReceivedNotificationsV1(
            apiParams.startDate,
            apiParams.endDate,
            apiParams.mandateId,
            apiParams.recipientId,
            apiParams.status,
            apiParams.subjectRegExp,
            apiParams.iunMatch,
            apiParams.size,
            apiParams.nextPagesKey
          );
      return response.data as GetNotificationsResponse;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);
