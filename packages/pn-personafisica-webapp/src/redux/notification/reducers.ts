import { createSlice } from '@reduxjs/toolkit';
import {
  NotificationStatus,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailRecipient,
  INotificationDetailTimeline,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  PaymentDetail,
  NotificationFeePolicy,
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
    paProtocolNumber: '',
    subject: '',
    recipients: [] as Array<NotificationDetailRecipient>,
    documents: [] as Array<NotificationDetailDocument>,
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
