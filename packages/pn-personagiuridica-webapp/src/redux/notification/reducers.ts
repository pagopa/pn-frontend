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
  RecipientType,
  PaymentStatus,
  PaymentInfoDetail,
  Downtime,
  PaymentHistory,
} from '@pagopa-pn/pn-commons';

import { NotificationDetailForRecipient } from '../../models/NotificationDetail';

import {
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
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
  downtimeLegalFactUrl: '', // the non-filled value for URLs must be a falsy value in order to ensure expected behavior of useDownloadDocument
  // analogous for other URLs
  paymentInfo: [] as Array<PaymentHistory>,
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
    setF24Payments: (state, action) => {
      state.paymentInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getReceivedNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
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
        // Not single payment reload
        if (action.payload.length > 1) {
          state.paymentInfo = action.payload;
          return;
        }

        if (action.payload.length === 1) {
          const paymentInfo = action.payload[0];
          const paymentInfoIndex = state.paymentInfo.findIndex(
            (payment) =>
              payment.pagoPA?.creditorTaxId === paymentInfo.pagoPA?.creditorTaxId &&
              payment.pagoPA?.noticeCode === paymentInfo.pagoPA?.noticeCode
          );
          if (paymentInfoIndex !== -1) {
            state.paymentInfo[paymentInfoIndex] = paymentInfo;
            return;
          }
          state.paymentInfo = action.payload;
        }
      }
    });
    builder.addCase(getNotificationPaymentUrl.rejected, (state, action) => {
      const noticeCode = action.meta.arg.paymentNotice.noticeNumber;
      const creditorTaxId = action.meta.arg.paymentNotice.fiscalCode;
      const paymentInfo = state.paymentInfo.find(
        (payment) =>
          payment.pagoPA?.creditorTaxId === creditorTaxId &&
          payment.pagoPA?.noticeCode === noticeCode
      );

      if (paymentInfo && paymentInfo.pagoPA) {
        const updatedPaymentInfo = {
          ...paymentInfo?.f24Data,
          pagoPA: {
            ...paymentInfo?.pagoPA,
            status: PaymentStatus.FAILED,
            detail: PaymentInfoDetail.GENERIC_ERROR,
          },
        };

        state.paymentInfo = [...state.paymentInfo, updatedPaymentInfo];
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

export const { resetState, resetLegalFactState, clearDowntimeLegalFactData, setF24Payments } =
  notificationSlice.actions;

export default notificationSlice;
