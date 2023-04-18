import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  NotificationDetail, LegalFactId, performThunkAction, NotificationDetailOtherDocument,
  DowntimeLogPage,
  GetNotificationDowntimeEventsParams,
  KnownFunctionality,
  LegalFactDocumentDetails,
} from '@pagopa-pn/pn-commons';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { AppStatusApi } from '../../api/appStatus/AppStatus.api';

export enum NOTIFICATION_ACTIONS {
  GET_SENT_NOTIFICATION = 'getSentNotification',
  GET_DOWNTIME_EVENTS = 'getDowntimeEvents',
  GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS = 'getNotificationDowntimeLegalFactDocumentDetails',  
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

export const getDowntimeEvents = createAsyncThunk<DowntimeLogPage, GetNotificationDowntimeEventsParams>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_EVENTS,
  performThunkAction((params: GetNotificationDowntimeEventsParams) => {
    const completeParams = {...params,
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
export const getDowntimeLegalFactDocumentDetails = createAsyncThunk<LegalFactDocumentDetails, string>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS,
  performThunkAction((legalFactId: string) => AppStatusApi.getLegalFactDetails(legalFactId))
);

