import {
  DowntimeLogHistory,
  GetDowntimeHistoryParams,
  LegalFactId,
  NotificationDetail,
  NotificationDetailOtherDocument,
  PaymentAttachment,
  PaymentAttachmentNameType,
  PaymentDetails,
  PaymentNotice,
  checkIfPaymentsIsAlreadyInCache,
  getPaymentCache,
  parseError,
  performThunkAction,
  populatePaymentsPagoPaF24,
  setPaymentCache,
  setPaymentsInCache,
  validateHistory,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { DowntimeApiFactory } from '../../generated-client/downtime-logs';
import { NotificationReceivedApiFactory } from '../../generated-client/notifications';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { parseNotificationDetailForRecipient } from '../../utility/notification.utility';
import { RootState, store } from '../store';
import { GetReceivedNotificationParams } from './types';

export enum NOTIFICATION_ACTIONS {
  GET_RECEIVED_NOTIFICATION = 'getReceivedNotification',
  GET_NOTIFICATION_PAYMENT_INFO = 'getNotificationPaymentInfo',
  GET_NOTIFICATION_PAYMENT_URL = 'getNotificationPaymentUrl',
  GET_DOWNTIME_HISTORY = 'getNotificationDowntimeHistory',
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
      return parseNotificationDetailForRecipient(response.data as NotificationDetail);
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getReceivedNotificationLegalfact = createAsyncThunk<
  { url: string; retryAfter?: number },
  { iun: string; legalFact: LegalFactId; mandateId?: string }
>(
  'getReceivedNotificationLegalfact',
  performThunkAction((params: { iun: string; legalFact: LegalFactId; mandateId?: string }) =>
    NotificationsApi.getReceivedNotificationLegalfact(
      params.iun,
      params.legalFact,
      params.mandateId
    )
  )
);

export const getReceivedNotificationDocument = createAsyncThunk<
  { url: string },
  { iun: string; documentIndex: string; mandateId?: string }
>(
  'getReceivedNotificationDocument',
  performThunkAction((params: { iun: string; documentIndex: string; mandateId?: string }) =>
    NotificationsApi.getReceivedNotificationDocument(
      params.iun,
      params.documentIndex,
      params.mandateId
    )
  )
);

export const getPaymentAttachment = createAsyncThunk<
  PaymentAttachment,
  {
    iun: string;
    attachmentName: PaymentAttachmentNameType;
    mandateId?: string;
    attachmentIdx?: number;
  }
>(
  'getPaymentAttachment',
  performThunkAction(
    (params: {
      iun: string;
      attachmentName: PaymentAttachmentNameType;
      mandateId?: string;
      attachmentIdx?: number;
    }) =>
      NotificationsApi.getPaymentAttachment(
        params.iun,
        params.attachmentName,
        params.mandateId,
        params.attachmentIdx
      )
  ),
  {
    getPendingMeta: () => ({ blockLoading: true }),
  }
);

export const getNotificationPaymentInfo = createAsyncThunk<
  Array<PaymentDetails>,
  { taxId: string; paymentInfoRequest: Array<{ noticeCode: string; creditorTaxId: string }> },
  { state: RootState }
>(
  NOTIFICATION_ACTIONS.GET_NOTIFICATION_PAYMENT_INFO,
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

      if (paymentCache?.payments) {
        // If i have the current payment in cache means that i'm coming from the payment page and i need to update the payment
        if (paymentCache?.currentPayment) {
          const updatedPayment = await NotificationsApi.getNotificationPaymentInfo([
            paymentCache.currentPayment,
          ]);

          const payments = populatePaymentsPagoPaF24(
            notificationState.notification.timeline,
            notificationState.paymentsData.pagoPaF24,
            updatedPayment
          );
          setPaymentsInCache(payments, iun);
          return payments;
        }

        // If all the payments are already in cache i can return them
        if (checkIfPaymentsIsAlreadyInCache(params.paymentInfoRequest, iun)) {
          return paymentCache.payments;
        }
      }

      // If i don't have the payments in cache i need to request all the payments to ext-registries
      const paymentInfo = await NotificationsApi.getNotificationPaymentInfo(
        params.paymentInfoRequest
      );

      const payments = populatePaymentsPagoPaF24(
        notificationState.notification.timeline,
        notificationState.paymentsData.pagoPaF24,
        paymentInfo
      );

      setPaymentsInCache(payments, iun);

      return payments;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  {
    getPendingMeta: () => ({ blockLoading: true }),
  }
);

export const getNotificationPaymentUrl = createAsyncThunk<
  { checkoutUrl: string },
  { paymentNotice: PaymentNotice; returnUrl: string },
  { state: RootState }
>(
  NOTIFICATION_ACTIONS.GET_NOTIFICATION_PAYMENT_URL,
  performThunkAction((params: { paymentNotice: PaymentNotice; returnUrl: string }) => {
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
    return NotificationsApi.getNotificationPaymentUrl(params.paymentNotice, params.returnUrl);
  })
);

export const getReceivedNotificationOtherDocument = createAsyncThunk<
  { url: string; retryAfter?: number },
  { iun: string; otherDocument: NotificationDetailOtherDocument; mandateId?: string }
>(
  'getReceivedNotificationOtherDocument',
  async (
    params: {
      iun: string;
      mandateId?: string;
      otherDocument: {
        documentId: string;
        documentType: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      return await NotificationsApi.getReceivedNotificationOtherDocument(
        params.iun,
        params.otherDocument,
        params.mandateId
      );
    } catch (e) {
      return rejectWithValue(e);
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
