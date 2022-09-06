import {
  LegalFactId,
  PaymentAttachmentNameType,
  PaymentInfo,
  performThunkAction,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { GetReceivedNotificationParams } from './types';

export enum NOTIFICATION_ACTIONS  {
  GET_RECEIVED_INFORMATION = 'getReceivedNotification',
  GET_NOTIFICATION_PAYMENT_INFO = 'getNotificationPaymentInfo',
}


export const getReceivedNotification = createAsyncThunk<
  NotificationDetailForRecipient,
  GetReceivedNotificationParams
>(
  NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMATION,
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
  { url: string },
  { iun: string; legalFact: LegalFactId; mandateId?: string }
>(
  'getReceivedNotificationLegalfact',
  async (
    params: { iun: string; legalFact: LegalFactId; mandateId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await NotificationsApi.getReceivedNotificationLegalfact(
        params.iun,
        params.legalFact,
        params.mandateId
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getReceivedNotificationDocument = createAsyncThunk<
  { url: string },
  { iun: string; documentIndex: string; mandateId?: string }
>(
  'getReceivedNotificationDocument',
  async (
    params: { iun: string; documentIndex: string; mandateId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await NotificationsApi.getReceivedNotificationDocument(
        params.iun,
        params.documentIndex,
        params.mandateId
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getPaymentAttachment = createAsyncThunk<
  { url: string },
  { iun: string; attachmentName: PaymentAttachmentNameType; mandateId?: string }
>(
  'getPaymentAttachment',
  async (
    params: { iun: string; attachmentName: PaymentAttachmentNameType; mandateId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await NotificationsApi.getPaymentAttachment(
        params.iun,
        params.attachmentName,
        params.mandateId
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
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
