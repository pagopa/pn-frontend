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
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  PaymentsData,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
  setPaymentsInCache,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import {
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
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
    builder.addCase(getNotificationPaymentInfo.fulfilled, (state, action) => {
      if (action.payload) {
        const paymentInfo = action.payload;
        // eslint-disable-next-line functional/no-let
        let pageNumber = 0;
        // eslint-disable-next-line functional/no-let
        let payments = {
          pagoPaF24: [],
          f24Only: [],
        } as PaymentsData;

        paymentInfo.forEach((payment) => {
          const paymentInfoIndex = state.paymentsData.pagoPaF24.findIndex(
            (paymentData) =>
              paymentData.pagoPa?.creditorTaxId === payment.pagoPa?.creditorTaxId &&
              paymentData.pagoPa?.noticeCode === payment.pagoPa?.noticeCode
          );
          if (paymentInfoIndex !== -1) {
            state.paymentsData.pagoPaF24[paymentInfoIndex] = payment;

            const indexOfPayment = state.notification.recipients[0].payments?.findIndex(
              (recPayment) =>
                recPayment.pagoPa?.noticeCode === payment.pagoPa?.noticeCode &&
                recPayment.pagoPa?.creditorTaxId === payment.pagoPa?.creditorTaxId
            );
            if (indexOfPayment !== undefined) {
              pageNumber = Math.floor(indexOfPayment / 5);

              payments = {
                pagoPaF24: [
                  ...payments.pagoPaF24,
                  {
                    ...payment,
                  },
                ],
                f24Only: state.paymentsData.f24Only,
              };
            }
          }
        });

        setPaymentsInCache(payments, pageNumber);
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

      if (paymentInfo?.pagoPa) {
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
