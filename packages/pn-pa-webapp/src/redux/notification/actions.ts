import {
  DowntimeLogPage,
  GetNotificationDowntimeEventsParams,
  KnownFunctionality,
  LegalFactDocumentDetails,
  LegalFactId,
  NotificationDetail,
  NotificationDetailOtherDocument,
  PaymentAttachment,
  PaymentAttachmentNameType,
  parseError,
  performThunkAction,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AppStatusApi } from '../../api/appStatus/AppStatus.api';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationSentApiFactory } from '../../generated-client/notifications';

export enum NOTIFICATION_ACTIONS {
  GET_SENT_NOTIFICATION = 'getSentNotification',
  GET_DOWNTIME_EVENTS = 'getDowntimeEvents',
  GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS = 'getNotificationDowntimeLegalFactDocumentDetails',
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
      const response = await notificationSentApiFactory.retrieveSentNotificationV1(params);
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

export const getDowntimeEvents = createAsyncThunk<
  DowntimeLogPage,
  GetNotificationDowntimeEventsParams
>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_EVENTS,
  performThunkAction((params: GetNotificationDowntimeEventsParams) => {
    const completeParams = {
      ...params,
      functionality: [
        KnownFunctionality.NotificationCreate,
        KnownFunctionality.NotificationVisualization,
        KnownFunctionality.NotificationWorkflow,
      ],
      // size and page parameters are not needed since we are interested in all downtimes
      // within the given time range
    };
    return AppStatusApi.getDowntimeLogPage(completeParams);
  })
);

// copy of the action having same name in the appStatus slice!!
export const getDowntimeLegalFactDocumentDetails = createAsyncThunk<
  LegalFactDocumentDetails,
  string
>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS,
  performThunkAction((legalFactId: string) => AppStatusApi.getLegalFactDetails(legalFactId))
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
