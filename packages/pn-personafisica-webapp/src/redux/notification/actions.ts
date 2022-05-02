import { LegalFactId, NotificationDetail, PaymentDetail } from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';

export const getReceivedNotification = createAsyncThunk<NotificationDetail, string>(
  'getReceivedNotification',
  async (params: string, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getReceivedNotification(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getReceivedNotificationLegalfact = createAsyncThunk<
  { url: string },
  { iun: string; legalFact: LegalFactId }
>(
  'getReceivedNotificationLegalfact',
  async (params: { iun: string; legalFact: LegalFactId }, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getReceivedNotificationLegalfact(params.iun, params.legalFact);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getReceivedNotificationDocument = createAsyncThunk<
  { url: string },
  { iun: string; documentIndex: number }
>(
  'getReceivedNotificationDocument',
  async (params: { iun: string; documentIndex: number }, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getReceivedNotificationDocument(params.iun, params.documentIndex);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getNotificationPaymentInfo = createAsyncThunk<
  PaymentDetail,
  string
>(
  'getNotificationPaymentInfo',
  async (params: string, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getNotificationPaymentInfo(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetState = createAction<void>('resetState');
