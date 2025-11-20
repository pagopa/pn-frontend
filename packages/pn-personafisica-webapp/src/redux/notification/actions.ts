import {
  DowntimeLogHistory,
  ExtRegistriesPaymentDetails,
  GetDowntimeHistoryParams,
  NotificationDetail,
  NotificationDocumentRequest,
  NotificationDocumentResponse,
  PaymentAttachment,
  PaymentAttachmentSName,
  PaymentDetails,
  PaymentNotice,
  PaymentStatus,
  checkIfPaymentsIsAlreadyInCache,
  getPaymentCache,
  parseError,
  populatePaymentsPagoPaF24,
  setPaymentCache,
  setPaymentsInCache,
  validateHistory,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { DowntimeApiFactory } from '../../generated-client/downtime-logs';
import {
  BffCheckAarRequest,
  BffCheckAarResponse,
  NotificationReceivedApiFactory,
} from '../../generated-client/notifications';
import { BffPaymentTppResponse, PaymentsApiFactory } from '../../generated-client/payments';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { PFEventsType } from '../../models/PFEventsType';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { parseNotificationDetailForRecipient } from '../../utility/notification.utility';
import { RootState, store } from '../store';
import { GetReceivedNotificationParams } from './types';

export enum NOTIFICATION_ACTIONS {
  GET_RECEIVED_NOTIFICATION = 'getReceivedNotification',
  GET_RECEIVED_NOTIFICATION_DOCUMENT = 'getReceivedNotificationDocument',
  GET_RECEIVED_NOTIFICATION_PAYMENT = 'getReceivedNotificationPayment',
  GET_RECEIVED_NOTIFICATION_PAYMENT_INFO = 'getReceivedNotificationPaymentInfo',
  GET_RECEIVED_NOTIFICATION_PAYMENT_URL = 'getReceivedNotificationPaymentUrl',
  GET_DOWNTIME_HISTORY = 'getNotificationDowntimeHistory',
  EXCHANGE_NOTIFICATION_QR_CODE = 'exchangeNotificationQrCode',
  GET_RECEIVED_NOTIFICATION_PAYMENT_TPP_URL = 'getReceivedNotificationPaymentTppUrl',
}

export const getReceivedNotification = createAsyncThunk<
  NotificationDetailForRecipient,
  GetReceivedNotificationParams
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION,
  async (params: GetReceivedNotificationParams, { rejectWithValue }) => {
    try {
      const notificationReceivedApiFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationReceivedApiFactory.getReceivedNotificationV1(
        params.iun,
        params.mandateId
      );
      return parseNotificationDetailForRecipient(
        response.data as NotificationDetail,
        params.currentUserTaxId,
        params.delegatorsFromStore,
        params.mandateId
      );
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getReceivedNotificationDocument = createAsyncThunk<
  NotificationDocumentResponse,
  NotificationDocumentRequest
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_DOCUMENT,
  async (params: NotificationDocumentRequest, { rejectWithValue }) => {
    try {
      const notificationSentApiFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationSentApiFactory.getReceivedNotificationDocumentV1(
        params.iun,
        params.documentType,
        params.mandateId,
        params.documentIdx,
        params.documentId
      );
      return response.data as NotificationDocumentResponse;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getReceivedNotificationPayment = createAsyncThunk<
  PaymentAttachment,
  {
    iun: string;
    attachmentName: PaymentAttachmentSName;
    mandateId?: string;
    attachmentIdx?: number;
  }
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT,
  async (
    params: {
      iun: string;
      attachmentName: PaymentAttachmentSName;
      mandateId?: string;
      attachmentIdx?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const notificationReceivedApiFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await notificationReceivedApiFactory.getReceivedNotificationPaymentV1(
        params.iun,
        params.attachmentName,
        params.mandateId,
        params.attachmentIdx
      );
      return response.data as PaymentAttachment;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  },
  {
    getPendingMeta: () => ({ blockLoading: true }),
  }
);

export const getReceivedNotificationPaymentInfo = createAsyncThunk<
  Array<PaymentDetails>,
  { taxId: string; paymentInfoRequest: Array<{ noticeCode: string; creditorTaxId: string }> },
  { state: RootState }
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT_INFO,
  async (
    params: {
      taxId: string;
      paymentInfoRequest: Array<{ noticeCode: string; creditorTaxId: string }>;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const { notificationState } = getState();
      const iun = notificationState.notification.iun;
      const paymentCache = getPaymentCache(iun);
      const paymentsApiFactory = PaymentsApiFactory(undefined, undefined, apiClient);

      if (paymentCache?.payments) {
        // If i have the current payment in cache means that i'm coming from the payment page and i need to update the payment
        if (paymentCache?.currentPayment) {
          const updatedPaymentResponse = await paymentsApiFactory.getPaymentsInfoV1([
            paymentCache.currentPayment,
          ]);

          const updatedPayment = updatedPaymentResponse.data as Array<ExtRegistriesPaymentDetails>;

          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PAYMENT_OUTCOME, {
            outcome: updatedPayment[0].status,
          });

          if (updatedPayment[0].status === PaymentStatus.SUCCEEDED) {
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PAYMENTS_COUNT);
          }

          const payments = populatePaymentsPagoPaF24(
            notificationState.notification.timeline,
            notificationState.paymentsData.pagoPaF24,
            updatedPayment
          );
          const updatedCache = setPaymentsInCache(payments, iun);
          return updatedCache.payments;
        }

        // If all the payments are already in cache i can return them
        if (checkIfPaymentsIsAlreadyInCache(params.paymentInfoRequest, iun)) {
          return paymentCache.payments;
        }
      }

      // If i don't have the payments in cache i need to request all the payments to ext-registries
      const paymentInfoResponse = await paymentsApiFactory.getPaymentsInfoV1(
        params.paymentInfoRequest
      );

      const paymentInfo = paymentInfoResponse.data as Array<ExtRegistriesPaymentDetails>;

      const payments = populatePaymentsPagoPaF24(
        notificationState.notification.timeline,
        notificationState.paymentsData.pagoPaF24,
        paymentInfo
      );

      setPaymentsInCache(payments, iun);

      return payments;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  },
  {
    getPendingMeta: () => ({ blockLoading: true }),
  }
);

export const getReceivedNotificationPaymentUrl = createAsyncThunk<
  { checkoutUrl: string },
  { paymentNotice: PaymentNotice; returnUrl: string },
  { state: RootState }
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT_URL,
  async (params: { paymentNotice: PaymentNotice; returnUrl: string }, { rejectWithValue }) => {
    try {
      const paymentsApiFactory = PaymentsApiFactory(undefined, undefined, apiClient);
      const iun = store.getState().notificationState.notification.iun;
      setPaymentCache(
        {
          currentPayment: {
            noticeCode: params.paymentNotice.noticeNumber,
            creditorTaxId: params.paymentNotice.fiscalCode,
          },
        },
        iun
      );
      const response = await paymentsApiFactory.paymentsCartV1(params);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getDowntimeHistory = createAsyncThunk<DowntimeLogHistory, GetDowntimeHistoryParams>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_HISTORY,
  async (params: GetDowntimeHistoryParams, { rejectWithValue }) => {
    try {
      const downtimeApiFactory = DowntimeApiFactory(undefined, undefined, apiClient);
      const response = await downtimeApiFactory.getStatusHistoryV1(
        params.startDate,
        params.endDate,
        params.page,
        params.size
      );
      validateHistory(response.data as DowntimeLogHistory);
      return response.data as DowntimeLogHistory;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const exchangeNotificationQrCode = createAsyncThunk<BffCheckAarResponse, string>(
  NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_QR_CODE,
  async (aarQrCodeValue: string, { rejectWithValue }) => {
    try {
      const notificationReceivedApiFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const request: BffCheckAarRequest = { aarQrCodeValue };
      const response = await notificationReceivedApiFactory.checkAarQrCodeV1(request);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getReceivedNotificationPaymentTppUrl = createAsyncThunk<
  BffPaymentTppResponse,
  { retrievalId: string; noticeCode: string; creditorTaxId: string; amount?: number }
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT_TPP_URL,
  async ({ retrievalId, noticeCode, creditorTaxId, amount }, { rejectWithValue }) => {
    try {
      const paymentsApiFactory = PaymentsApiFactory(undefined, undefined, apiClient);
      const iun = store.getState().notificationState.notification.iun;
      setPaymentCache(
        {
          currentPayment: {
            noticeCode,
            creditorTaxId,
          },
        },
        iun
      );
      const response = await paymentsApiFactory.paymentsTppV1(
        retrievalId,
        noticeCode,
        creditorTaxId,
        amount
      );
      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
