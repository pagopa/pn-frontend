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
  PaymentAttachmentSName,
  PaymentInfo,
} from '@pagopa-pn/pn-commons';

import {
  getNotificationPaymentInfo,
  getPaymentAttachment,
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
  pagopaAttachmentUrl: '',
  f24AttachmentUrl: '',
  paymentInfo: {} as PaymentInfo,
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
    builder.addCase(getPaymentAttachment.fulfilled, (state, action) => {
      if (action.payload.url) {
        const attachmentName = action.meta.arg.attachmentName;
        if(attachmentName === PaymentAttachmentSName.PAGOPA) {
          state.pagopaAttachmentUrl = action.payload.url;
        } else if (attachmentName === PaymentAttachmentSName.F24) {
          state.f24AttachmentUrl = action.payload.url;
        }
      }
    });
    builder.addCase(getNotificationPaymentInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state.paymentInfo = action.payload;
      }
    });
    builder.addCase(resetState, () => initialState);
  },
});

export default notificationSlice;
