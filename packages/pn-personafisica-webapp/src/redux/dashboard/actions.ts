import {
  GetNotificationsParams,
  GetNotificationsResponse,
  formatFiscalCode,
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  parseError,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClients';
import { NotificationReceivedApiFactory, NotificationStatus } from '../../generated-client/notifications';

export enum DASHBOARD_ACTIONS {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

/**
 * Get received notifications
 */
export const getReceivedNotifications = createAsyncThunk(
  DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS,
  async (params: GetNotificationsParams<Date>, { rejectWithValue }) => {
    try {
      const receivedNotificationsFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const apiParams = {
        ...params,
        startDate: formatToTimezoneString(getStartOfDay(params.startDate)),
        endDate: formatToTimezoneString(getEndOfDay(params.endDate)),
        recipientId: params.recipientId ? formatFiscalCode(params.recipientId) : '',
        status: params.status as NotificationStatus | undefined,
      };
      const response = await receivedNotificationsFactory.searchReceivedNotificationsV1(
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
    }
    catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);