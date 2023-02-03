import { createSlice } from '@reduxjs/toolkit';
import {
  NotificationStatus,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailRecipient,
  INotificationDetailTimeline,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  NotificationFeePolicy,
  Downtime,
} from '@pagopa-pn/pn-commons';
import {
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
} from './actions';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [] as Array<NotificationDetailRecipient>,
    documents: [] as Array<NotificationDetailDocument>,
    otherDocuments: [] as Array<NotificationDetailDocument>,
    notificationFeePolicy: '' as NotificationFeePolicy,
    physicalCommunicationType: '' as PhysicalCommunicationType,
    senderPaId: '',
    iun: '',
    sentAt: '',
    notificationStatus: '' as NotificationStatus,
    notificationStatusHistory: [] as Array<NotificationStatusHistory>,
    timeline: [] as Array<INotificationDetailTimeline>
  } as NotificationDetail,
  documentDownloadUrl: '',
  otherDocumentDownloadUrl: '',
  legalFactDownloadUrl: '',
  legalFactDownloadRetryAfter: 0,
  downtimeLegalFactUrl: '',  // the non-filled value for URLs must be a falsy value in order to ensure expected behavior of useDownloadDocument
                            // analogous for other URLs
  downtimeEvents: [] as Array<Downtime>,
};

/* eslint-disable functional/immutable-data */
const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
    resetLegalFactState: (state) => {
      state.legalFactDownloadUrl = '';
      state.legalFactDownloadRetryAfter = 0;
    },
    clearDowntimeLegalFactData: (state) => {
      state.downtimeLegalFactUrl = '';
    },     
  },
  extraReducers: (builder) => {
    builder.addCase(getSentNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
    builder.addCase(getSentNotificationDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.documentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getSentNotificationOtherDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.otherDocumentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getSentNotificationLegalfact.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.legalFactDownloadUrl = action.payload.url;
      }
      if (action.payload.retryAfter) {
        state.legalFactDownloadRetryAfter = action.payload.retryAfter;
      }
    });
    builder.addCase(getDowntimeEvents.fulfilled, (state, action) => {
      state.downtimeEvents = action.payload.downtimes;
    });
    builder.addCase(getDowntimeLegalFactDocumentDetails.fulfilled, (state, action) => {
      // by the moment we preserve only the URL. 
      // if the need of showing the file size arises in the future,
      // we'll probably need to change this in order to keep the whole response from the API call
      // -----------------------
      // Carlos Lombardi, 2023.02.02
      state.downtimeLegalFactUrl = action.payload.url;
    });    
  },
});

export const {resetState, resetLegalFactState, clearDowntimeLegalFactData} = notificationSlice.actions;

export default notificationSlice;
