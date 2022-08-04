import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationFeePolicy, PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { FormRecipient, NewNotificationFe, PaymentModel } from '../../models/NewNotification';
import { formatNotificationRecipients } from '../../utils/notification.utility';
import {
  uploadNotificationAttachment,
  setPaymentDocuments,
  setAttachments,
  setRecipients,
  uploadNotificationPaymentDocument,
} from './actions';

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
    setSenderInfos: (state, action: PayloadAction<{senderDenomination: string; senderTaxId: string}>) => {
      state.notification.senderDenomination = action.payload.senderDenomination;
      state.notification.senderTaxId = action.payload.senderTaxId;
    },
    setPreliminaryInformations: (state, action: PayloadAction<{
      paProtocolNumber: string;
      subject: string;
      abstract?: string;
      physicalCommunicationType: PhysicalCommunicationType;
      group?: string;
      paymentMode: PaymentModel;
    }>) => {
      // TODO: capire la logica di set della fee policy sia corretta
      state.notification = {
        ...state.notification,
        ...action.payload,
        notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
      };
    },
    saveRecipients: (state, action: PayloadAction<{recipients: Array<FormRecipient>}>) => {
      state.notification.recipients = formatNotificationRecipients(action.payload.recipients);
    },
    resetState: () => initialState
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
            // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
            creditorTaxId: r.payment!.creditorTaxId,
            noticeCode: r.payment?.noticeCode,
          };
          return r;
        }),
      };
      state.isCompleted = true;
    });
    builder.addCase(setRecipients, (state, action) => {
      state.notification = {
        ...state.notification,
        recipientsForm: action.payload.recipients,
      };
    });
    builder.addCase(setAttachments, (state, action) => {
      state.notification = {
        ...state.notification,
        documentsForm: action.payload.documents,
      };
    });
    builder.addCase(setPaymentDocuments, (state, action) => {
      state.notification = {
        ...state.notification,
        paymentDocumentsForm: action.payload.paymentMethodsDocuments,
      };
    });
  },
});

export const {setCancelledIun, setSenderInfos, setPreliminaryInformations, saveRecipients, resetState} = newNotificationSlice.actions;

export default newNotificationSlice;
