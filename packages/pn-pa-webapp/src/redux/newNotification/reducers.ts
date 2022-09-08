import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationFeePolicy, PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { FormRecipient, NewNotificationFe, PaymentModel } from '../../models/NewNotification';
import { UserGroup } from '../../models/user';
import { formatNotificationRecipients } from '../../utils/notification.utility';
import {
  uploadNotificationAttachment,
  setPaymentDocuments,
  setAttachments,
  setRecipients,
  uploadNotificationPaymentDocument,
  getUserGroups,
} from './actions';
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
      };
    },
    saveRecipients: (state, action: PayloadAction<{ recipients: Array<FormRecipient> }>) => {
      state.notification.recipients = formatNotificationRecipients(action.payload.recipients);
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getUserGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
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

export const {
  setCancelledIun,
  setSenderInfos,
  setPreliminaryInformations,
  saveRecipients,
  resetState,
} = newNotificationSlice.actions;

export default newNotificationSlice;
