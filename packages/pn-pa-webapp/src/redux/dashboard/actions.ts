import {
  GetNotificationsParams,
  GetNotificationsResponse,
  NotificationStatus,
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
import { NotificationSentApiFactory } from '../../generated-client/notifications';

export enum DASHBOARD_ACTIONS {
  GET_SENT_NOTIFICATIONS = 'getSentNotifications',
}
/**
 * Get sent notifications
 */
export const getSentNotifications = createAsyncThunk(
  'getSentNotifications',
  async (params: GetNotificationsParams, { rejectWithValue }) => {
    try {
      const sentNotificationsFactory = NotificationSentApiFactory(undefined, undefined, apiClient);
      const startDate = params.startDate || tenYearsAgo;
      const endDate = params.endDate || today;
      const apiParams = {
        ...params,
        startDate: formatToTimezoneString(getStartOfDay(startDate)),
        endDate: formatToTimezoneString(getEndOfDay(endDate)),
        recipientId: params.recipientId ? formatFiscalCode(params.recipientId) : undefined,
        status:
          (params.status as Exclude<
            NotificationStatus,
            | NotificationStatus.CANCELLATION_IN_PROGRESS
            | NotificationStatus.NOTIFICATION_TIMELINE_REWORKED
          >) || undefined,
        subjectRegExp: params.subjectRegExp || undefined,
        iunMatch: params.iunMatch || undefined,
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
