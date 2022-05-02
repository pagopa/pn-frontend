import { createSlice } from '@reduxjs/toolkit';
import {
  NotificationStatus,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  INotificationDetailTimeline,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  PaymentDetail,
} from '@pagopa-pn/pn-commons';

import {
  getNotificationPaymentInfo,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
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
    timeline: [] as Array<INotificationDetailTimeline>,
    physicalCommunicationType: '' as PhysicalCommunicationType,
  } as NotificationDetail,
  documentDownloadUrl: '',
  legalFactDownloadUrl: '',
  paymentDetail: {} as PaymentDetail,
};

/* eslint-disable functional/immutable-data */
const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getReceivedNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
    builder.addCase(getReceivedNotificationDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.documentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getReceivedNotificationLegalfact.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.legalFactDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getNotificationPaymentInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state.paymentDetail = action.payload;
      }
    });
    builder.addCase(resetState, () => initialState);
  },
});

export default notificationSlice;
