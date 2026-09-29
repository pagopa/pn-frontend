import {
  EventNotificationTypes,
  ExtRegistriesPaymentDetails,
  NotificationDocumentResponse,
  PaymentAttachment,
  PaymentAttachmentSName,
  PaymentDetails,
  getPaymentCache,
  parseError,
  setPaymentsInCache,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  BffFullInformalNotificationV1,
  RecipientInformalNotificationsApiFactory,
} from '../../generated-client/informal-notifications';
import { PaymentsApiFactory } from '../../generated-client/payments';
import { PFEventsType } from '../../models/PFEventsType';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { RootState } from '../store';

export enum INFORMAL_NOTIFICATION_ACTIONS {
  GET_RECEIVED_INFORMAL_NOTIFICATION = 'getReceivedInformalNotification',
  GET_RECEIVED_INFORMAL_NOTIFICATION_DOCUMENT = 'getReceivedInformalNotificationDocument',
  GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT_INFO = 'getReceivedInformalNotificationPaymentInfo',
  GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT = 'getReceivedInformalNotificationPayment',
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
    mandateId?: string;
    attachmentIdx?: number;
  }
>(
  INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT,
  async (
    params: {
      iun: string;
      attachmentName: PaymentAttachmentSName;
      attachmentIdx?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const informalNotificationsApiFactory = RecipientInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response =
        await informalNotificationsApiFactory.getReceivedInformalNotificationPaymentAttachmentV1(
          params.iun,
          params.attachmentName,
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

export const getReceivedInformalNotificationPaymentInfo = createAsyncThunk<
  Array<ExtRegistriesPaymentDetails>,
  { paymentInfoRequest: Array<{ noticeCode: string; creditorTaxId: string }> },
  { state: RootState }
>(
  INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT_INFO,
  async ({ paymentInfoRequest }, { rejectWithValue, getState, signal }) => {
    try {
      const { notificationState } = getState();
      const iun = notificationState.informalNotification?.iun ?? '';
      const paymentCache = getPaymentCache(iun);
      const paymentsApiFactory = PaymentsApiFactory(undefined, undefined, apiClient);
      if (paymentCache?.currentPayment) {
        const updatedPaymentResponse = await paymentsApiFactory.getPaymentsInfoV1(
          [paymentCache.currentPayment],
          { signal }
        );

        const updatedPayment = updatedPaymentResponse.data as Array<ExtRegistriesPaymentDetails>;

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PAYMENT_OUTCOME, {
          outcome: updatedPayment[0].status,
          notification_type: EventNotificationTypes.INFORMAL,
        });

        return updatedPayment;
      }

      const response = await paymentsApiFactory.getPaymentsInfoV1(paymentInfoRequest, { signal });

      const paymentInfo = response.data as Array<ExtRegistriesPaymentDetails>;

      const payments: Array<PaymentDetails> = paymentInfo.map((info) => ({
        pagoPa: {
          ...info,
          applyCost: false,
        },
      }));

      setPaymentsInCache(payments, iun);

      return paymentInfo;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  },
  {
    getPendingMeta: () => ({ blockLoading: true }),
  }
);
