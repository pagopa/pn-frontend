import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationFeePolicy, PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { FormRecipient, NewNotificationFe, PaymentModel } from '../../models/NewNotification';
import { formatNotificationRecipients } from '../../utils/notification.utility';
import { uploadNotificationAttachment, uploadNotificationPaymentDocument } from './actions';
import { PreliminaryInformationsPayload } from './types';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    cancelledIun: '',
    recipients: [],
    documents: [],
    physicalCommunicationType: '' as PhysicalCommunicationType,
    group: '',
    paymentMode: '' as PaymentModel,
    notificationFeePolicy: '' as NotificationFeePolicy,
  } as NewNotificationFe,
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
        notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
      };
    },
    saveRecipients: (state, action: PayloadAction<{ recipients: Array<FormRecipient> }>) => {
      state.notification.recipients = formatNotificationRecipients(action.payload.recipients);
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(uploadNotificationAttachment.fulfilled, (state, action) => {
      state.notification = { ...state.notification, documents: action.payload };
    });
    builder.addCase(uploadNotificationPaymentDocument.fulfilled, (state, action) => {
      state.notification = {
        ...state.notification,
        recipients: state.notification.recipients.map((r) => {
          r.payment = {
            ...action.payload[r.taxId],
            creditorTaxId: r.payment ? r.payment.creditorTaxId : '',
            noticeCode: r.payment?.noticeCode,
          };
          return r;
        }),
      };
      state.isCompleted = true;
    });
  },
});

export const {
  setCancelledIun,
  setSenderInfos,
  setPreliminaryInformations,
  saveRecipients,
  resetState,
} = newNotificationSlice.actions;

export default newNotificationSlice;
