import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetNotificationsParams, GetNotificationsResponse, performThunkAction } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';

export enum DASHBOARD_ACTIONS {
  GET_SENT_NOTIFICATIONS = 'getSentNotifications',
}

export const getSentNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>(DASHBOARD_ACTIONS.GET_SENT_NOTIFICATIONS, 
  performThunkAction((params: GetNotificationsParams) => NotificationsApi.getSentNotifications(params))
);
