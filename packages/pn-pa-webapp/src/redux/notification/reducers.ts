import { createSlice } from '@reduxjs/toolkit';
import {
  NotificationStatus,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationDetailTimeline,
  NotificationStatusHistory,
  PhysicalCommunicationType,
} from '@pagopa-pn/pn-commons';
import {
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  resetState,
} from './actions';

const initialState = {
  loading: false,
  notification: {
    iun: '',
    paNotificationId: '',
    subject: '',
    sentAt: '',
    cancelledIun: '',
    cancelledByIun: '',
    recipients: [] as Array<NotificationDetailRecipient>,
    documents: [] as Array<NotificationDetailDocument>,
    payment: {} as NotificationDetailPayment,
    notificationStatus: '' as NotificationStatus,
    notificationStatusHistory: [] as Array<NotificationStatusHistory>,
    timeline: [] as Array<NotificationDetailTimeline>,
    physicalCommunicationType: '' as PhysicalCommunicationType,
  } as NotificationDetail,
  documentDownloadUrl: '',
  legalFactDownloadUrl: '',
};

/* eslint-disable functional/immutable-data */
const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSentNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
    builder.addCase(getSentNotificationDocument.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSentNotificationDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.documentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getSentNotificationLegalfact.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.legalFactDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(resetState, () => initialState);
  },
});

export default notificationSlice;
