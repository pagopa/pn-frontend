import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { GetNotificationsParams, GetNotificationsResponse, performThunkAction, Sort } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationColumn } from '../../models/Notifications';

export enum DASHBOARD_ACTIONS {
  GET_SENT_NOTIFICATIONS = 'getSentNotifications',
}

export const getSentNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>(DASHBOARD_ACTIONS.GET_SENT_NOTIFICATIONS, 
  performThunkAction((params: GetNotificationsParams) => NotificationsApi.getSentNotifications(params))
);

export const setPagination = createAction<{ page: number; size: number }>('setPagination');

export const setSorting = createAction<Sort<NotificationColumn>>('setSorting');

export const setNotificationFilters =
  createAction<GetNotificationsParams>('setNotificationFilters');
