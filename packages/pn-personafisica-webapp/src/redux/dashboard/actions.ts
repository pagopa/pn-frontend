import { GetNotificationsParams, GetNotificationsResponse, Sort } from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationColumn } from '../../models/Notifications';

export const getReceivedNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>('getReceivedNotifications', async (params: GetNotificationsParams, { rejectWithValue }) => {
  try {
    return await NotificationsApi.getReceivedNotifications(params);
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const setPagination = createAction<{ page: number; size: number }>('setPagination');

export const setSorting = createAction<Sort<NotificationColumn>>('setSorting');

export const setNotificationFilters =
  createAction<GetNotificationsParams>('setNotificationFilters');

export const setMandateId = createAction<string | undefined>('setMandateId');
