import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  NewNotification,
  NewNotificationDocument,
  NewNotificationRecipient,
  NotificationFeePolicy,
  PagoPaIntegrationMode,
  PaymentModel,
  PreliminaryInformationsPayload,
} from '../../models/NewNotification';
import { UserGroup } from '../../models/user';
import { filterPaymentsByDebtPositionChange } from '../../utility/notification.utility';
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
    notificationFeePolicy: '' as NotificationFeePolicy,
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
    setDebtPosition: (
      state,
      action: PayloadAction<{
        recipients: Array<NewNotificationRecipient>;
      }>
    ) => {
      const { recipients } = action.payload;

      recipients.forEach(({ taxId, debtPosition: newDebtPosition }) => {
        const currentRecipientIdx = state.notification.recipients.findIndex(
          (r) => r.taxId === taxId
        );

        // Skip if recipient not found
        if (currentRecipientIdx === -1 || !newDebtPosition) {
          return;
        }

        const currentRecipient = state.notification.recipients[currentRecipientIdx];
        const oldDebtPosition = currentRecipient.debtPosition;

        // Update payments
        const updatedPayments = filterPaymentsByDebtPositionChange(
          currentRecipient.payments || [],
          newDebtPosition,
          oldDebtPosition
        );

        state.notification.recipients[currentRecipientIdx] = {
          ...currentRecipient,
          debtPosition: newDebtPosition,
          payments: updatedPayments,
        };
      });

      if (recipients.every((r) => r.debtPosition === PaymentModel.NOTHING)) {
        state.notification = {
          ...state.notification,
          notificationFeePolicy: '' as NotificationFeePolicy,
          paFee: undefined,
          vat: undefined,
          pagoPaIntMode: undefined,
        };
      }
    },
    setDebtPositionDetail: (
      state,
      action: PayloadAction<{
        recipients: Array<NewNotificationRecipient>;
        vat?: number;
        paFee?: string;
        notificationFeePolicy: NotificationFeePolicy;
        pagoPaIntMode?: PagoPaIntegrationMode;
      }>
    ) => {
      state.notification = {
        ...state.notification,
        recipients: action.payload.recipients,
        vat: action.payload.vat,
        paFee: action.payload.paFee,
        notificationFeePolicy: action.payload.notificationFeePolicy,
        pagoPaIntMode: action.payload.pagoPaIntMode,
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
    });
    builder.addCase(uploadNotificationPaymentDocument.fulfilled, (state, action) => {
      state.notification.recipients = action.payload;
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
  setDebtPositionDetail,
  resetState,
  setIsCompleted,
  setDebtPosition,
} = newNotificationSlice.actions;

export default newNotificationSlice;
