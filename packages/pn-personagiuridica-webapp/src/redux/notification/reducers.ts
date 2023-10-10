import {
  Downtime,
  F24PaymentDetails,
  INotificationDetailTimeline,
  NotificationDetailDocument,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  NotificationStatus,
  NotificationStatusHistory,
  PaidDetails,
  PaymentAttachmentSName,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

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
  paymentsData: {
    pagoPaF24: [] as Array<PaymentDetails>,
    f24Only: [] as Array<F24PaymentDetails>,
  },
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
    builder.addCase(getReceivedNotification.fulfilled, (state, action) => {
      const recipientIdx = action.payload.recipients.findIndex(
        (recipient) => recipient.taxId === action.payload.currentRecipient.taxId
      );
      const paymentsOfRecipient = action.payload.recipients[recipientIdx].payments;

      if (paymentsOfRecipient) {
        if (
          action.payload.notificationStatus === NotificationStatus.CANCELLED ||
          action.payload.notificationStatus === NotificationStatus.CANCELLATION_IN_PROGRESS
        ) {
          const timelineEvents = action.payload.timeline.filter(
            (item) => item.category === TimelineCategory.PAYMENT
          );

          // get only the payments of the current recipient that are in the timeline (by creditorTaxId and noticeCode
          const timelineRecipientPayments = paymentsOfRecipient.filter((payment) =>
            timelineEvents.some(
              (timelineEvent) =>
                (timelineEvent.details as PaidDetails).creditorTaxId ===
                  payment.pagoPa?.creditorTaxId &&
                (timelineEvent.details as PaidDetails).noticeCode === payment.pagoPa?.noticeCode
            )
          );

          const payments = populatePaymentsPagoPaF24(timelineEvents, timelineRecipientPayments, []);
          state.paymentsData.pagoPaF24 = payments;
        } else {
          const pagoPAPaymentFullDetails = getPagoPaF24Payments(
            paymentsOfRecipient,
            recipientIdx,
            true
          );
          const f24Payments = getF24Payments(paymentsOfRecipient, recipientIdx);

          if (pagoPAPaymentFullDetails) {
            state.paymentsData.pagoPaF24 = pagoPAPaymentFullDetails;
          }

          if (f24Payments) {
            state.paymentsData.f24Only = f24Payments;
          }
        }
      }
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
          state.paymentsData.pagoPaF24 = action.payload;
          return;
        }

        if (action.payload.length === 1) {
          const paymentInfo = action.payload[0];
          const paymentInfoIndex = state.paymentsData.pagoPaF24.findIndex(
            (payment) =>
              payment.pagoPa?.creditorTaxId === paymentInfo.pagoPa?.creditorTaxId &&
              payment.pagoPa?.noticeCode === paymentInfo.pagoPa?.noticeCode
          );
          if (paymentInfoIndex !== -1) {
            state.paymentsData.pagoPaF24[paymentInfoIndex] = paymentInfo;
            return;
          }
          state.paymentsData.pagoPaF24 = action.payload;
        }
      }
    });
    builder.addCase(getNotificationPaymentInfo.pending, (state, action) => {
      if (action.meta.arg.paymentInfoRequest.length === 1) {
        const payment = state.paymentsData.pagoPaF24.find(
          (payment) =>
            payment.pagoPa?.creditorTaxId === action.meta.arg.paymentInfoRequest[0].creditorTaxId &&
            payment.pagoPa?.noticeCode === action.meta.arg.paymentInfoRequest[0].noticeCode
        );

        if (payment) {
          payment.isLoading = true;
          return;
        }
      }
    });
    builder.addCase(getNotificationPaymentUrl.rejected, (state, action) => {
      const noticeCode = action.meta.arg.paymentNotice.noticeNumber;
      const creditorTaxId = action.meta.arg.paymentNotice.fiscalCode;
      const paymentInfo = state.paymentsData.pagoPaF24.find(
        (payment) =>
          payment.pagoPa?.creditorTaxId === creditorTaxId &&
          payment.pagoPa?.noticeCode === noticeCode
      );

      if (paymentInfo && paymentInfo.pagoPa) {
        state.paymentsData.pagoPaF24 = [
          ...state.paymentsData.pagoPaF24,
          {
            ...paymentInfo?.f24,
            pagoPa: {
              ...paymentInfo?.pagoPa,
              status: PaymentStatus.FAILED,
              detail: PaymentInfoDetail.GENERIC_ERROR,
            },
          },
        ];
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

export const { resetState, resetLegalFactState, clearDowntimeLegalFactData } =
  notificationSlice.actions;

export default notificationSlice;
