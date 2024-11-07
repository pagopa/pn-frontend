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
  getReceivedNotification,
  getReceivedNotificationPaymentInfo,
  getReceivedNotificationPaymentUrl,
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

          // get only the payments of the current recipient that are in the timeline (by creditorTaxId and noticeCode)
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
    builder.addCase(getReceivedNotificationPaymentInfo.fulfilled, (state, action) => {
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
    builder.addCase(getReceivedNotificationPaymentInfo.pending, (state, action) => {
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
    builder.addCase(getReceivedNotificationPaymentUrl.rejected, (state, action) => {
      const noticeCode = action.meta.arg.paymentNotice.noticeNumber;
      const creditorTaxId = action.meta.arg.paymentNotice.fiscalCode;
      const paymentInfoIndex = state.paymentsData.pagoPaF24.findIndex(
        (paymentData) =>
          paymentData.pagoPa?.creditorTaxId === creditorTaxId &&
          paymentData.pagoPa?.noticeCode === noticeCode
      );
      if (paymentInfoIndex !== -1) {
        const pagoPa = state.paymentsData.pagoPaF24[paymentInfoIndex].pagoPa;

        if (pagoPa) {
          pagoPa.status = PaymentStatus.FAILED;
          pagoPa.detail = PaymentInfoDetail.GENERIC_ERROR;
        }
      }
    });
    builder.addCase(getDowntimeHistory.fulfilled, (state, action) => {
      state.downtimeEvents = action.payload.result;
    });
  },
});

export const { resetState } = notificationSlice.actions;

export default notificationSlice;
