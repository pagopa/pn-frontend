import {
  DowntimeLogHistory,
  GetDowntimeHistoryParams,
  NotificationDetail,
  NotificationDocumentRequest,
  NotificationDocumentResponse,
  PaymentAttachment,
  PaymentAttachmentSName,
  parseError,
  validateHistory,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { DowntimeApiFactory } from '../../generated-client/downtime-logs';
import { NotificationSentApiFactory } from '../../generated-client/notifications';

export enum NOTIFICATION_ACTIONS {
  GET_SENT_NOTIFICATION = 'getSentNotification',
  GET_SENT_NOTIFICATION_DOCUMENT = 'getSentNotificationDocument',
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

/**
 * Cancels a notification
 */
export const cancelNotification = createAsyncThunk(
  NOTIFICATION_ACTIONS.CANCEL_NOTIFICATION,
  async (params: string, { rejectWithValue }) => {
    try {
      const notificationSentApiFactory = NotificationSentApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationSentApiFactory.notificationCancellationV1(params);
      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getSentNotificationDocument = createAsyncThunk<
  NotificationDocumentResponse,
  NotificationDocumentRequest
>(
  NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION_DOCUMENT,
  async (params: NotificationDocumentRequest, { rejectWithValue }) => {
    try {
      const notificationSentApiFactory = NotificationSentApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationSentApiFactory.getSentNotificationDocumentV1(
        params.iun,
        params.documentType,
        params.documentIdx,
        params.documentId,
        params.documentCategory
      );
      return response.data as NotificationDocumentResponse;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
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
