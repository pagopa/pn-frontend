import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationFeePolicy, PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';

import {
  NewNotificationRecipient,
  NewNotification,
  PaymentModel,
  NewNotificationDocument,
  PaymentObject,
} from '../../models/NewNotification';

import { UserGroup } from '../../models/user';
import {
  uploadNotificationAttachment,
  uploadNotificationPaymentDocument,
  getUserGroups,
  createNewNotification,
} from './actions';
import { PreliminaryInformationsPayload } from './types';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [],
    documents: [],
    payment: {},
    physicalCommunicationType: '' as PhysicalCommunicationType,
    group: '',
    taxonomyCode: '',
    paymentMode: '' as PaymentModel,
    notificationFeePolicy: '' as NotificationFeePolicy,
  } as NewNotification,
  groups: [] as Array<UserGroup>,
  isCompleted: false,
};

/* eslint-disable functional/immutable-data */
const newNotificationSlice = createSlice({
  name: 'newNotificationSlice',
  initialState,
  reducers: {
    setCancelledIun: (state, action: PayloadAction<string>) => {
      state.notification.cancelledIun = action.payload;
    },
    setSenderInfos: (
      state,
      action: PayloadAction<{ senderDenomination: string; senderTaxId: string }>
    ) => {
      state.notification.senderDenomination = action.payload.senderDenomination;
      state.notification.senderTaxId = action.payload.senderTaxId;
    },
    setPreliminaryInformations: (state, action: PayloadAction<PreliminaryInformationsPayload>) => {
      // TODO: capire la logica di set della fee policy sia corretta
      state.notification = {
        ...state.notification,
        ...action.payload,
        // PN-1835
        // in questa fase la notificationFeePolicy viene assegnata di default a FLAT_RATE
        // Carlotta Dimatteo 10/08/2022
        notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
        // reset payment data if payment mode has changed
        payment:
          state.notification.paymentMode !== action.payload.paymentMode
            ? {}
            : state.notification.payment,
      };
    },
    saveRecipients: (
      state,
      action: PayloadAction<{ recipients: Array<NewNotificationRecipient> }>
    ) => {
      state.notification.recipients = action.payload.recipients.map((r) => ({
        ...r,
        taxId: r.taxId.toUpperCase(),
      }));
    },
    setAttachments: (
      state,
      action: PayloadAction<{ documents: Array<NewNotificationDocument> }>
    ) => {
      state.notification.documents = action.payload.documents;
    },
    setPaymentDocuments: (
      state,
      action: PayloadAction<{ paymentDocuments: { [key: string]: PaymentObject } }>
    ) => {
      state.notification = {
        ...state.notification,
        payment: action.payload.paymentDocuments,
      };
    },
    setIsCompleted: (state) => {
      state.isCompleted = true;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getUserGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
    builder.addCase(uploadNotificationAttachment.fulfilled, (state, action) => {
      state.notification.documents = action.payload;
      state.isCompleted = getConfiguration().IS_PAYMENT_ENABLED ? false : true;
    });
    builder.addCase(uploadNotificationPaymentDocument.fulfilled, (state, action) => {
      state.notification.payment = action.payload;
      state.isCompleted = true;
    });
    builder.addCase(createNewNotification.rejected, (state) => {
      state.isCompleted = false;
    });
  },
});

export const {
  setCancelledIun,
  setSenderInfos,
  setPreliminaryInformations,
  saveRecipients,
  setAttachments,
  setPaymentDocuments,
  resetState,
  setIsCompleted,
} = newNotificationSlice.actions;

export default newNotificationSlice;
