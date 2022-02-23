import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { Legalfacts, NotificationDetail } from './types';

export const getSentNotification = createAsyncThunk<NotificationDetail, string>(
  'getSentNotification',
  async (params: string, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotification(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getSentNotificationLegalfacts = createAsyncThunk<Array<Legalfacts>, string>(
    'getSentNotificationLegalfacts',
    async (params: string, { rejectWithValue }) => {
      try {
        return await NotificationsApi.getSentNotificationLegalfacts(params);
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );
