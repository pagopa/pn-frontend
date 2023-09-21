import {
  Downtime,
  F24PaymentDetails,
  INotificationDetailTimeline,
  NotificationDetailDocument,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  NotificationStatus,
  NotificationStatusHistory,
  PagoPAPaymentFullDetails,
  PaymentAttachmentSName,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  PhysicalCommunicationType,
  RecipientType,
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
      const paymentsOfRecipient = action.payload.recipients.find(
        (recipient) => recipient.taxId === action.payload.currentRecipient.taxId
      )?.payments;

      if (paymentsOfRecipient) {
        const f24Payments = paymentsOfRecipient.reduce((arr, payment) => {
          if (!payment.pagoPA && payment.f24) {
            // eslint-disable-next-line functional/immutable-data
            arr.push(payment.f24);
          }
          return arr;
        }, [] as Array<F24PaymentDetails>);

        const pagoPAPaymentFullDetails = paymentsOfRecipient.reduce((arr, payment) => {
          if (payment.pagoPA) {
            // eslint-disable-next-line functional/immutable-data
            arr.push({
              pagoPA: payment.pagoPA as PagoPAPaymentFullDetails,
              f24: payment.f24,
              isLoading: true,
            });
          }
          return arr;
        }, [] as Array<PaymentDetails>);

        if (pagoPAPaymentFullDetails) {
          state.paymentsData.pagoPaF24 = pagoPAPaymentFullDetails;
        }

        if (f24Payments) {
          state.paymentsData.f24Only = f24Payments;
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
              payment.pagoPA?.creditorTaxId === paymentInfo.pagoPA?.creditorTaxId &&
              payment.pagoPA?.noticeCode === paymentInfo.pagoPA?.noticeCode
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
            payment.pagoPA?.creditorTaxId === action.meta.arg.paymentInfoRequest[0].creditorTaxId &&
            payment.pagoPA?.noticeCode === action.meta.arg.paymentInfoRequest[0].noticeCode
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
          payment.pagoPA?.creditorTaxId === creditorTaxId &&
          payment.pagoPA?.noticeCode === noticeCode
      );

      if (paymentInfo && paymentInfo.pagoPA) {
        state.paymentsData.pagoPaF24 = [
          ...state.paymentsData.pagoPaF24,
          {
            ...paymentInfo?.f24,
            pagoPA: {
              ...paymentInfo?.pagoPA,
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
