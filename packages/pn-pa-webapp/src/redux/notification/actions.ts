import {
  DowntimeLogHistory,
  GetDowntimeHistoryParams,
  LegalFactId,
  NotificationDetail,
  NotificationDetailOtherDocument,
  PaymentAttachment,
  PaymentAttachmentSName,
  parseError,
  performThunkAction,
  validateHistory,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { DowntimeApiFactory } from '../../generated-client/downtime-logs';
import { NotificationSentApiFactory } from '../../generated-client/notifications';

export enum NOTIFICATION_ACTIONS {
  GET_SENT_NOTIFICATION = 'getSentNotification',
  GET_SENT_NOTIFICATION_PAYMENT = 'getSentNotificationPayment',
  GET_DOWNTIME_HISTORY = 'getNotificationDowntimeHistory',
  CANCEL_NOTIFICATION = 'cancelNotification',
}

export const getSentNotification = createAsyncThunk<NotificationDetail, string>(
  NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION,
  async (params: string, { rejectWithValue }) => {
    try {
      const notificationSentApiFactory = NotificationSentApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationSentApiFactory.getSentNotificationV1(params);
      return response.data as NotificationDetail;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

// da cambiare il ritorno nel caso venga restituito qualcosa
export const cancelNotification = createAsyncThunk<
  string,
  string,
  { dispatch: <AnyAction>(action: AnyAction) => AnyAction }
>(
  NOTIFICATION_ACTIONS.CANCEL_NOTIFICATION,
  performThunkAction((params: string) => NotificationsApi.cancelNotification(params))
);

export const getSentNotificationLegalfact = createAsyncThunk<
  { url: string; retryAfter?: number },
  { iun: string; legalFact: LegalFactId }
>(
  'getSentNotificationLegalfact',
  async (params: { iun: string; legalFact: LegalFactId }, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotificationLegalfact(params.iun, params.legalFact);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getSentNotificationDocument = createAsyncThunk<
  { url: string },
  { iun: string; documentIndex: string }
>(
  'getSentNotificationDocument',
  async (params: { iun: string; documentIndex: string }, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getSentNotificationDocument(params.iun, params.documentIndex);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getSentNotificationOtherDocument = createAsyncThunk<
  { url: string; retryAfter?: number },
  { iun: string; otherDocument: NotificationDetailOtherDocument }
>(
  'getSentNotificationOtherDocument',
  performThunkAction(
    (params: {
      iun: string;
      otherDocument: {
        documentId: string;
        documentType: string;
      };
    }) => NotificationsApi.getSentNotificationOtherDocument(params.iun, params.otherDocument)
  )
);

export const getDowntimeHistory = createAsyncThunk<DowntimeLogHistory, GetDowntimeHistoryParams>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_HISTORY,
  async (params: GetDowntimeHistoryParams, { rejectWithValue }) => {
    try {
      const downtimeApiFactory = DowntimeApiFactory(undefined, undefined, apiClient);
      const response = await downtimeApiFactory.getStatusHistoryV1(
        params.startDate,
        params.endDate,
        params.page,
        params.size
      );
      validateHistory(response.data as DowntimeLogHistory);
      return response.data as DowntimeLogHistory;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getSentNotificationPayment = createAsyncThunk<
  PaymentAttachment,
  {
    iun: string;
    attachmentName: PaymentAttachmentSName;
    recIndex: number;
    attachmentIdx?: number;
  }
>(
  NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION_PAYMENT,
  async (
    params: {
      iun: string;
      attachmentName: PaymentAttachmentSName;
      recIndex: number;
      attachmentIdx?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const notificationSentApiFactory = NotificationSentApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationSentApiFactory.getSentNotificationPaymentV1(
        params.iun,
        params.recIndex,
        params.attachmentName,
        params.attachmentIdx
      );
      return response.data as PaymentAttachment;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
