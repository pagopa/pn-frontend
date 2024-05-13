import {
  GetNotificationsParams,
  GetNotificationsResponse,
  NotificationStatus,
  formatFiscalCode,
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  parseError,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { NotificationSentApiFactory } from '../../generated-client/notifications';

export enum DASHBOARD_ACTIONS {
  GET_SENT_NOTIFICATIONS = 'getSentNotifications',
}
/**
 * Get sent notifications
 */
export const getSentNotifications = createAsyncThunk(
  'getSentNotifications',
  async (params: GetNotificationsParams<Date>, { rejectWithValue }) => {
    try {
      const sentNotificationsFactory = NotificationSentApiFactory(undefined, undefined, apiClient);
      const apiParams = {
        ...params,
        startDate: formatToTimezoneString(getStartOfDay(params.startDate)),
        endDate: formatToTimezoneString(getEndOfDay(params.endDate)),
        recipientId: params.recipientId ? formatFiscalCode(params.recipientId) : undefined,
        status: params.status as NotificationStatus || undefined,
        subjectRegExp: params.subjectRegExp || undefined,
        iunMatch: params.iunMatch || undefined
      };
      const response = await sentNotificationsFactory.searchSentNotificationsV1(
        apiParams.startDate,
        apiParams.endDate,
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
