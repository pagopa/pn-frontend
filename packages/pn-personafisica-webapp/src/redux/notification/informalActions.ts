import {
  ExtRegistriesPaymentDetails,
  NotificationDocumentResponse,
  PaymentAttachment,
  PaymentAttachmentSName,
  parseError,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  BffFullInformalNotificationV1,
  RecipientInformalNotificationsApiFactory,
} from '../../generated-client/informal-notifications';
import { PaymentsApiFactory } from '../../generated-client/payments';

export enum INFORMAL_NOTIFICATION_ACTIONS {
  GET_RECEIVED_INFORMAL_NOTIFICATION = 'getReceivedInformalNotification',
  GET_RECEIVED_INFORMAL_NOTIFICATION_DOCUMENT = 'getReceivedInformalNotificationDocument',
  GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT = 'getReceivedInformalNotificationPayment',
  GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT_INFO = 'getReceivedInformalNotificationPaymentInfo',
}

export const getReceivedInformalNotification = createAsyncThunk<
  BffFullInformalNotificationV1,
  string
>(
  INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION,
  async (iun: string, { rejectWithValue }) => {
    try {
      const informalNotificationsApiFactory = RecipientInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response = await informalNotificationsApiFactory.getReceivedInformalNotificationV1(iun);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getReceivedInformalNotificationDocument = createAsyncThunk<
  NotificationDocumentResponse,
  { iun: string; docIdx: number }
>(
  INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION_DOCUMENT,
  async ({ iun, docIdx }, { rejectWithValue }) => {
    try {
      const informalNotificationsApiFactory = RecipientInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response =
        await informalNotificationsApiFactory.getReceivedInformalNotificationDocumentV1(
          iun,
          docIdx
        );

      return response.data as NotificationDocumentResponse;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getReceivedInformalNotificationPayment = createAsyncThunk<
  PaymentAttachment,
  {
    iun: string;
    attachmentName: PaymentAttachmentSName;
    attachmentIdx?: number;
  }
>(
  INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT,
  async ({ iun, attachmentName, attachmentIdx }, { rejectWithValue }) => {
    try {
      const informalNotificationsApiFactory = RecipientInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response =
        await informalNotificationsApiFactory.getReceivedInformalNotificationPaymentAttachmentV1(
          iun,
          attachmentName,
          attachmentIdx
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

export const getReceivedInformalNotificationPaymentInfo = createAsyncThunk<
  Array<ExtRegistriesPaymentDetails>,
  { paymentInfoRequest: Array<{ noticeCode: string; creditorTaxId: string }> }
>(
  INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT_INFO,
  async ({ paymentInfoRequest }, { rejectWithValue, signal }) => {
    try {
      const paymentsApiFactory = PaymentsApiFactory(undefined, undefined, apiClient);

      const response = await paymentsApiFactory.getPaymentsInfoV1(paymentInfoRequest, { signal });

      return response.data as Array<ExtRegistriesPaymentDetails>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  },
  {
    getPendingMeta: () => ({ blockLoading: true }),
  }
);
