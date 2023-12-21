import {
  GetNotificationsParams,
  GetNotificationsResponse,
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  performThunkAction,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';

export enum DASHBOARD_ACTIONS {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

export const getReceivedNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams<Date>
>(
  DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS,
  performThunkAction((params: GetNotificationsParams<Date>) => {
    const apiParams = {
      ...params,
      startDate: formatToTimezoneString(getStartOfDay(params.startDate)),
      endDate: formatToTimezoneString(getEndOfDay(params.endDate)),
    };
    return NotificationsApi.getReceivedNotifications(apiParams);
  })
);
