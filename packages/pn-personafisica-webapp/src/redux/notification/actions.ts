import {
  LegalFactId,
  PaymentAttachmentNameType,
  PaymentInfo,
  performThunkAction,
} from '@pagopa-pn/pn-commons';
import {
  NotificationDetailOtherDocument,
  PaymentNotice,
} from '@pagopa-pn/pn-commons/src/types/NotificationDetail';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { GetReceivedNotificationParams } from './types';

export enum NOTIFICATION_ACTIONS {
  GET_RECEIVED_NOTIFICATION = 'getReceivedNotification',
  GET_NOTIFICATION_PAYMENT_INFO = 'getNotificationPaymentInfo',
  GET_NOTIFICATION_PAYMENT_URL = 'getNotificationPaymentUrl',
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
  { url: string },
  { iun: string; attachmentName: PaymentAttachmentNameType; mandateId?: string }
>(
  'getPaymentAttachment',
  performThunkAction(
    (params: { iun: string; attachmentName: PaymentAttachmentNameType; mandateId?: string }) =>
      NotificationsApi.getPaymentAttachment(params.iun, params.attachmentName, params.mandateId)
  )
);

export const getNotificationPaymentInfo = createAsyncThunk<
  PaymentInfo,
  { noticeCode: string; taxId: string }
>(
  NOTIFICATION_ACTIONS.GET_NOTIFICATION_PAYMENT_INFO,
  performThunkAction((params: { noticeCode: string; taxId: string }) =>
    NotificationsApi.getNotificationPaymentInfo(params.noticeCode, params.taxId)
  )
);

export const getNotificationPaymentUrl = createAsyncThunk<
  { checkoutUrl: string },
  { paymentNotice: PaymentNotice; returnUrl: string }
>(
  NOTIFICATION_ACTIONS.GET_NOTIFICATION_PAYMENT_URL,
  performThunkAction((params: { paymentNotice: PaymentNotice; returnUrl: string }) =>
    NotificationsApi.getNotificationPaymentUrl(params.paymentNotice, params.returnUrl)
  )
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
