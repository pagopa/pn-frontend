import { GetNotificationsParams, GetNotificationsResponse, performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';

export enum DASHBOARD_ACTIONS  {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

export const getReceivedNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams & { isDelegatedPage: boolean }
>(DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS, 
  performThunkAction(
    (params: GetNotificationsParams & { isDelegatedPage: boolean }) =>
      NotificationsApi.getReceivedNotifications(params)
  ),
);
