import {
  DowntimeLogHistory,
  GetDowntimeHistoryParams,
  NotificationDetail,
  NotificationDocumentRequest,
  NotificationDocumentResponse,
  PaymentAttachment,
  PaymentAttachmentNameType,
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
  GET_SENT_NOTIFICATION_DOCUMENT = 'getSentNotificationDocument',
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

export const getPaymentAttachment = createAsyncThunk<
  PaymentAttachment,
  {
    iun: string;
    attachmentName: PaymentAttachmentNameType;
    recIndex: number;
    attachmentIdx?: number;
  }
>(
  'getPaymentAttachment',
  performThunkAction(
    (params: {
      iun: string;
      attachmentName: PaymentAttachmentNameType;
      recIndex: number;
      attachmentIdx?: number;
    }) =>
      NotificationsApi.getPaymentAttachment(
        params.iun,
        params.attachmentName,
        params.recIndex,
        params.attachmentIdx
      )
  )
);
