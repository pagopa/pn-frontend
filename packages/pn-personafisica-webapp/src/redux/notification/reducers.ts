import { createSlice } from '@reduxjs/toolkit';
import {
  NotificationStatus,
  NotificationDetailDocument,
  NotificationDetailRecipient,
  INotificationDetailTimeline,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  NotificationFeePolicy,
  PaymentAttachmentSName,
  PaymentInfo,
  RecipientType,
  PaymentStatus,
  PaymentInfoDetail,
  Downtime,
} from '@pagopa-pn/pn-commons';

import { NotificationDetailForRecipient } from '../../models/NotificationDetail';

import {
  getDowntimeEvents,
  getNotificationPaymentInfo,
  getNotificationPaymentUrl,
  getPaymentAttachment,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
  getReceivedNotificationOtherDocument,
} from './actions';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [] as Array<NotificationDetailRecipient>,
    senderDenomination: '',
    paymentExpirationDate: '',
    documents: [] as Array<NotificationDetailDocument>,
    otherDocuments: [] as Array<NotificationDetailDocument>,
    notificationFeePolicy: '' as NotificationFeePolicy,
    physicalCommunicationType: '' as PhysicalCommunicationType,
    senderPaId: '',
    iun: '',
    sentAt: '',
    notificationStatus: '' as NotificationStatus,
    notificationStatusHistory: [] as Array<NotificationStatusHistory>,
    timeline: [] as Array<INotificationDetailTimeline>,
    currentRecipient: {
      recipientType: RecipientType.PF,
      taxId: '',
      denomination: '',
    },
    currentRecipientIndex: 0,
  } as NotificationDetailForRecipient,
  documentDownloadUrl: '',
  otherDocumentDownloadUrl: '',
  legalFactDownloadUrl: '',
  legalFactDownloadRetryAfter: 0,
  pagopaAttachmentUrl: '',
  f24AttachmentUrl: '',
  paymentInfo: {} as PaymentInfo,
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
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getReceivedNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
      if (action.payload.iun === "KQKX-WMDW-GDMU-202301-L-1") {
        // const acceptedStatusRecord = state.notification.notificationStatusHistory.find(record => record.status === NotificationStatus.ACCEPTED);
        // if (acceptedStatusRecord) {
        //   acceptedStatusRecord.activeFrom = "2023-01-26T15:59:23.333432372Z";
        // }
        // state.notification.notificationStatusHistory = state.notification.notificationStatusHistory.filter(record => record.status !== NotificationStatus.EFFECTIVE_DATE);
      }
    });
    builder.addCase(getReceivedNotificationDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.documentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getReceivedNotificationOtherDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.otherDocumentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getReceivedNotificationLegalfact.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.legalFactDownloadUrl = action.payload.url;
      }
      if (action.payload.retryAfter) {
        state.legalFactDownloadRetryAfter = action.payload.retryAfter;
      }
    });
    builder.addCase(getPaymentAttachment.fulfilled, (state, action) => {
      if (action.payload.url) {
        const attachmentName = action.meta.arg.attachmentName;
        if (attachmentName === PaymentAttachmentSName.PAGOPA) {
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
    builder.addCase(getNotificationPaymentUrl.rejected, (state) => {
      state.paymentInfo = {
        ...state.paymentInfo,
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.GENERIC_ERROR,
      };
    });
    builder.addCase(getDowntimeEvents.fulfilled, (state, action) => {
      state.downtimeEvents = action.payload.downtimes;
    });
  },
});

export const { resetState, resetLegalFactState } = notificationSlice.actions;

export default notificationSlice;
