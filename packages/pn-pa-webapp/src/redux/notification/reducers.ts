import {
  Downtime,
  INotificationDetailTimeline,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

import {
  getDowntimeHistory,
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
} from './actions';

const initialState = {
  loading: false,
  notification: {
    subject: '',
    recipients: [] as Array<NotificationDetailRecipient>,
    documents: [] as Array<NotificationDetailDocument>,
    otherDocuments: [] as Array<NotificationDetailOtherDocument>,
    iun: '',
    sentAt: '',
    notificationStatus: '' as NotificationStatus,
    notificationStatusHistory: [] as Array<NotificationStatusHistory>,
    timeline: [] as Array<INotificationDetailTimeline>,
  } as NotificationDetail,
  documentDownloadUrl: '',
  otherDocumentDownloadUrl: '',
  legalFactDownloadUrl: '',
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSentNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
    // ATTO
    builder.addCase(getSentNotificationDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.documentDownloadUrl = action.payload.url;
      }
    });
    // AAR
    builder.addCase(getSentNotificationOtherDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.otherDocumentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getSentNotificationLegalfact.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.legalFactDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getDowntimeHistory.fulfilled, (state, action) => {
      state.downtimeEvents = action.payload.result;
    });
  },
});

export const { resetState, resetLegalFactState } = notificationSlice.actions;

export default notificationSlice;
