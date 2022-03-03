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

export const getSentNotificationDocument = createAsyncThunk<{url: string}, {iun: string; documentIndex: number}>(
  'getSentNotificationDocument',
  async (params: {iun: string; documentIndex: number}, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotificationDocument(params.iun, params.documentIndex);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
