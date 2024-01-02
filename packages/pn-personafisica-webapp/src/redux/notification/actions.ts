import {
  DowntimeLogPage,
  GetNotificationDowntimeEventsParams,
  KnownFunctionality,
  LegalFactDocumentDetails,
  LegalFactId,
  NotificationDetailOtherDocument,
  PaymentAttachment,
  PaymentAttachmentNameType,
  PaymentDetails,
  PaymentNotice,
  checkIfPaymentsIsAlreadyInCache,
  getPaymentCache,
  performThunkAction,
  populatePaymentsPagoPaF24,
  setPaymentCache,
  setPaymentsInCache,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppStatusApi } from '../../api/appStatus/AppStatus.api';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { RootState, store } from '../store';
import { GetReceivedNotificationParams } from './types';

export enum NOTIFICATION_ACTIONS {
  GET_RECEIVED_NOTIFICATION = 'getReceivedNotification',
  GET_NOTIFICATION_PAYMENT_INFO = 'getNotificationPaymentInfo',
  GET_NOTIFICATION_PAYMENT_URL = 'getNotificationPaymentUrl',
  GET_DOWNTIME_EVENTS = 'getDowntimeEvents',
  GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS = 'getNotificationDowntimeLegalFactDocumentDetails',
}

export const getReceivedNotification = createAsyncThunk<
  NotificationDetailForRecipient,
  GetReceivedNotificationParams
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION,
  performThunkAction((params: GetReceivedNotificationParams) =>
    NotificationsApi.getReceivedNotification(
      params.iun,
      params.currentUserTaxId,
      params.delegatorsFromStore,
      params.mandateId
    )
  )
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
          return paymentCache.payments;
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
  { url: string },
  { iun: string; otherDocument: NotificationDetailOtherDocument; mandateId?: string }
>(
  'getReceivedNotificationOtherDocument',
  performThunkAction(
    (params: {
      iun: string;
      mandateId?: string;
      otherDocument: {
        documentId: string;
        documentType: string;
      };
    }) =>
      NotificationsApi.getReceivedNotificationOtherDocument(
        params.iun,
        params.otherDocument,
        params.mandateId
      )
  )
);

export const getDowntimeEvents = createAsyncThunk<
  DowntimeLogPage,
  GetNotificationDowntimeEventsParams
>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_EVENTS,
  performThunkAction((params: GetNotificationDowntimeEventsParams) => {
    const completeParams = {
      ...params,
      functionality: [
        KnownFunctionality.NotificationCreate,
        KnownFunctionality.NotificationVisualization,
        KnownFunctionality.NotificationWorkflow,
      ],
      // size and page parameters are not needed since we are interested in all downtimes
      // within the given time range
    };
    return AppStatusApi.getDowntimeLogPage(completeParams);
  })
);

// copy of the action having same name in the appStatus slice!!
export const getDowntimeLegalFactDocumentDetails = createAsyncThunk<
  LegalFactDocumentDetails,
  string
>(
  NOTIFICATION_ACTIONS.GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS,
  performThunkAction((legalFactId: string) => AppStatusApi.getLegalFactDetails(legalFactId))
);
