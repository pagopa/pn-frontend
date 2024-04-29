import {
  Downtime,
  F24PaymentDetails,
  INotificationDetailTimeline,
  NotificationDetailDocument,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
  PaidDetails,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  RecipientType,
  TimelineCategory,
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import {
  getDowntimeHistory,
  getNotificationPaymentInfo,
  getNotificationPaymentUrl,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
  getReceivedNotificationOtherDocument,
} from './actions';

const initialState = {
  loading: false,
  notification: {
    subject: '',
    recipients: [] as Array<NotificationDetailRecipient>,
    senderDenomination: '',
    paymentExpirationDate: '',
    documents: [] as Array<NotificationDetailDocument>,
    otherDocuments: [] as Array<NotificationDetailDocument>,
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
    });
    builder.addCase(getNotificationPaymentInfo.fulfilled, (state, action) => {
      if (action.payload) {
        const paymentInfo = action.payload;
        for (const payment of paymentInfo) {
          const paymentInfoIndex = state.paymentsData.pagoPaF24.findIndex(
            (paymentData) =>
              paymentData.pagoPa?.creditorTaxId === payment.pagoPa?.creditorTaxId &&
              paymentData.pagoPa?.noticeCode === payment.pagoPa?.noticeCode
          );
          if (paymentInfoIndex !== -1) {
            state.paymentsData.pagoPaF24[paymentInfoIndex] = payment;
          }
        }
      }
    });
    builder.addCase(getNotificationPaymentInfo.pending, (state, action) => {
      const paymentInfo = action.meta.arg;
      for (const payment of paymentInfo.paymentInfoRequest) {
        const paymentInfoIndex = state.paymentsData.pagoPaF24.findIndex(
          (paymentData) =>
            paymentData.pagoPa?.creditorTaxId === payment.creditorTaxId &&
            paymentData.pagoPa?.noticeCode === payment.noticeCode
        );
        if (paymentInfoIndex !== -1) {
          state.paymentsData.pagoPaF24[paymentInfoIndex].isLoading = true;
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
    builder.addCase(getDowntimeHistory.fulfilled, (state, action) => {
      state.downtimeEvents = action.payload.result;
    });
  },
});

export const { resetState, resetLegalFactState } = notificationSlice.actions;

export default notificationSlice;
