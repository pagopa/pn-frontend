import { GetNotificationsParams, GetNotificationsResponse, Sort } from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationColumn } from '../../models/Notifications';

/* eslint-disable-next-line functional/no-let */
let niceCounter = 0;

export enum DASHBOARD_ACTIONS  {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

export const getReceivedNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>(DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS, async (params: GetNotificationsParams, { rejectWithValue }) => {
  console.log('in action getReceivedNotifications, niceCounter');
  console.log(niceCounter);
  const paramsToAdd = niceCounter % 2 === 0 ? { startDate: "toto" } : {};
  niceCounter++;
  try {
    return await NotificationsApi.getReceivedNotifications({...params, ...paramsToAdd});
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const setPagination = createAction<{ page: number; size: number }>('setPagination');

export const setSorting = createAction<Sort<NotificationColumn>>('setSorting');

export const setNotificationFilters =
  createAction<GetNotificationsParams>('setNotificationFilters');

export const setMandateId = createAction<string | undefined>('setMandateId');
