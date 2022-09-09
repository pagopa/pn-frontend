import { GetNotificationsParams, GetNotificationsResponse, performThunkAction, Sort } from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationColumn } from '../../models/Notifications';

export enum DASHBOARD_ACTIONS  {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

export const getReceivedNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>(DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS, 
  performThunkAction((params: GetNotificationsParams) => NotificationsApi.getReceivedNotifications(params))
);


export const setPagination = createAction<{ page: number; size: number }>('setPagination');

export const setSorting = createAction<Sort<NotificationColumn>>('setSorting');

export const setNotificationFilters =
  createAction<GetNotificationsParams>('setNotificationFilters');

export const setMandateId = createAction<string | undefined>('setMandateId');
