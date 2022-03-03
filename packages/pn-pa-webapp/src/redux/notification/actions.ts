import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationDetail, LegalFactId } from './types';

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

export const getSentNotificationLegalfact = createAsyncThunk<{url: string}, {iun: string; legalFact: LegalFactId}>(
  'getSentNotificationLegalfact',
  async (params: {iun: string; legalFact: LegalFactId}, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotificationLegalfact(params.iun, params.legalFact);
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
