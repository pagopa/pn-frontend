import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { GetNotificationsParams, GetNotificationsResponse } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';

export const getSentNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>('getSentNotifications', async (params: GetNotificationsParams, { rejectWithValue }) => {
  try {
    return await NotificationsApi.getSentNotifications(params);
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const setPagination = createAction<{ page: number; size: number }>('setPagination');

export const setSorting = createAction<{ orderBy: string; order: 'asc' | 'desc' }>('setSorting');

export const setNotificationFilters =
  createAction<GetNotificationsParams>('setNotificationFilters');
