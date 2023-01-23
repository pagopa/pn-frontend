import { createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationDetail, LegalFactId, performThunkAction, NotificationDetailOtherDocument } from '@pagopa-pn/pn-commons';
import { NotificationsApi } from '../../api/notifications/Notifications.api';

export enum NOTIFICATION_ACTIONS {
  GET_SENT_NOTIFICATION = 'getSentNotification',
};

export const getSentNotification = createAsyncThunk<NotificationDetail, string>(
  NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION, 
  performThunkAction((params: string) => NotificationsApi.getSentNotification(params))
);

export const getSentNotificationLegalfact = createAsyncThunk<{url: string; retryAfter?: number}, {iun: string; legalFact: LegalFactId}>(
  'getSentNotificationLegalfact',
  async (params: {iun: string; legalFact: LegalFactId}, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotificationLegalfact(params.iun, params.legalFact);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getSentNotificationDocument = createAsyncThunk<{url: string}, {iun: string; documentIndex: string}>(
  'getSentNotificationDocument',
  async (params: {iun: string; documentIndex: string}, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotificationDocument(params.iun, params.documentIndex);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getSentNotificationOtherDocument = createAsyncThunk<{url: string}, {iun: string; otherDocument: NotificationDetailOtherDocument}>(
  'getSentNotificationOtherDocument',
  async (params: {iun: string; otherDocument: { documentId: string; documentType: string }}, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotificationOtherDocument(params.iun, params.otherDocument);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);