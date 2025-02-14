import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  NewNotification,
  NewNotificationDocument,
  NewNotificationRecipient,
  PreliminaryInformationsPayload,
} from '../../models/NewNotification';
import { UserGroup } from '../../models/user';
import { getConfiguration } from '../../services/configuration.service';
import {
  createNewNotification,
  getUserGroups,
  uploadNotificationDocument,
  uploadNotificationPaymentDocument,
} from './actions';

type NewNotificationInitialState = {
  loading: boolean;
  notification: NewNotification;
  groups: Array<UserGroup>;
  isCompleted: boolean;
};

const initialState: NewNotificationInitialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [],
    documents: [],
    physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
    group: '',
    taxonomyCode: '',
    senderDenomination: '',
    senderTaxId: '',
  },
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
      state.notification = {
        ...state.notification,
        ...action.payload,
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
    setPayments: (
      state,
      action: PayloadAction<{ recipients: Array<NewNotificationRecipient> }>
    ) => {
      state.notification = {
        ...state.notification,
        recipients: action.payload.recipients,
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
    builder.addCase(uploadNotificationDocument.fulfilled, (state, action) => {
      state.notification.documents = action.payload;
      state.isCompleted = !getConfiguration().IS_PAYMENT_ENABLED;
    });
    builder.addCase(uploadNotificationPaymentDocument.fulfilled, (state, action) => {
      state.notification.recipients = action.payload;
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
  setPayments,
  resetState,
  setIsCompleted,
} = newNotificationSlice.actions;

export default newNotificationSlice;
