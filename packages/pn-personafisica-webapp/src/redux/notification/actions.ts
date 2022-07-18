import {
  LegalFactId,
  NotificationDetail,
  PaymentAttachmentNameType,
  PaymentInfo,
} from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';

export const getReceivedNotification = createAsyncThunk<
  NotificationDetail,
  { iun: string; mandateId?: string }
>(
  'getReceivedNotification',
  async (params: { iun: string; mandateId?: string }, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getReceivedNotification(params.iun, params.mandateId);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
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
  'getNotificationPaymentInfo',
  async (params: { noticeCode: string; taxId: string }, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getNotificationPaymentInfo(params.noticeCode, params.taxId);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetState = createAction<void>('resetState');
