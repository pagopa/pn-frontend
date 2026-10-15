import {
  DowntimeLogHistory,
  GetDowntimeHistoryParams,
  NotificationDetail,
  NotificationDocumentRequest,
  NotificationDocumentResponse,
  NotificationTimelineResponse,
  PaymentAttachment,
  PaymentAttachmentSName,
  parseError,
  validateHistory,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { DowntimeApiFactory } from '../../generated-client/downtime-logs';
import {
  BffDocumentDownloadMetadataResponse,
  BffFullSentInformalNotificationTimelineV1,
  BffFullSentInformalNotificationV1,
  SenderInformalNotificationsApiFactory,
} from '../../generated-client/informal-notifications';
import { NotificationSentApiFactory } from '../../generated-client/notifications';

export enum NOTIFICATION_ACTIONS {
  GET_SENT_NOTIFICATION = 'getSentNotification',
  GET_SENT_NOTIFICATION_TIMELINE = 'getSentNotificationTimeline',
  GET_SENT_NOTIFICATION_DOCUMENT = 'getSentNotificationDocument',
  GET_SENT_NOTIFICATION_PAYMENT = 'getSentNotificationPayment',
  GET_DOWNTIME_HISTORY = 'getNotificationDowntimeHistory',
  CANCEL_NOTIFICATION = 'cancelNotification',

  GET_SENT_INFORMAL_NOTIFICATION = 'getSentInformalNotification',
  GET_SENT_INFORMAL_NOTIFICATION_DOCUMENT = 'getSentInformalNotificationDocument',
  GET_SENT_INFORMAL_NOTIFICATION_PAYMENT = 'getSentInformalNotificationPayment',
  GET_SENT_INFORMAL_NOTIFICATION_TIMELINE = 'getSentInformalNotificationTimeline',
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

export const getSentNotificationTimeline = createAsyncThunk<NotificationTimelineResponse, string>(
  NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION_TIMELINE,
  async (params: string, { rejectWithValue }) => {
    try {
      const notificationSentApiFactory = NotificationSentApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationSentApiFactory.getSentNotificationTimelineV1(params);
      return response.data as NotificationTimelineResponse;
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
        params.documentId
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

/* INFORMAL */

export const getSentInformalNotification = createAsyncThunk<
  BffFullSentInformalNotificationV1,
  string
>(NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION, async (iun: string, { rejectWithValue }) => {
  try {
    const informalNotificationsApiFactory = SenderInformalNotificationsApiFactory(
      undefined,
      undefined,
      apiClient
    );

    const response = await informalNotificationsApiFactory.getSentInformalNotificationV1(iun);

    return response.data;
  } catch (e: any) {
    return rejectWithValue(parseError(e));
  }
});

export const getSentInformalNotificationDocument = createAsyncThunk<
  BffDocumentDownloadMetadataResponse,
  { iun: string; docIdx: number }
>(
  NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION_DOCUMENT,
  async (params, { rejectWithValue }) => {
    try {
      const senderInformalNotificationsApiFactory = SenderInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response =
        await senderInformalNotificationsApiFactory.getSentInformalNotificationDocumentV1(
          params.iun,
          params.docIdx
        );

      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getSentInformalNotificationPayment = createAsyncThunk<
  BffDocumentDownloadMetadataResponse,
  {
    iun: string;
    recipientIdx: number;
    attachmentName: PaymentAttachmentSName;
    attachmentIdx?: number;
  }
>(
  NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION_PAYMENT,
  async ({ iun, recipientIdx, attachmentName, attachmentIdx }, { rejectWithValue }) => {
    try {
      const informalNotificationsApiFactory = SenderInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response =
        await informalNotificationsApiFactory.getSentInformalNotificationAttachmentV1(
          iun,
          recipientIdx,
          attachmentName,
          attachmentIdx
        );

      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getSentInformalNotificationTimeline = createAsyncThunk<
  BffFullSentInformalNotificationTimelineV1,
  string
>(
  NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION_TIMELINE,
  async (iun: string, { rejectWithValue }) => {
    try {
      const informalNotificationsApiFactory = SenderInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response = await informalNotificationsApiFactory.getSentInformalNotificationTimelineV1(
        iun
      );

      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);
