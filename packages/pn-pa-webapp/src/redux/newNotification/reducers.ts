import { createSlice } from '@reduxjs/toolkit';
import { NotificationFeePolicy, PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from '../../models/newNotification';
import { formatNotificationRecipients } from '../../utils/notification.utility';
import {
  resetNewNotificationState,
  setCancelledIun,
  setPreliminaryInformations,
  uploadNotificationAttachment,
  saveRecipients,
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
  isCompleted: false
};

/* eslint-disable functional/immutable-data */
const newNotificationSlice = createSlice({
  name: 'newNotificationSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCancelledIun, (state, action) => {
      state.notification = { ...state.notification, cancelledIun: action.payload };
    });
    builder.addCase(setPreliminaryInformations, (state, action) => {
      // TODO: capire la logica di set della fee policy sia corretta
      state.notification = {
        ...state.notification,
        ...action.payload,
        notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE
      };
    });
    builder.addCase(saveRecipients, (state, action) => {
      state.notification.recipients = formatNotificationRecipients(action.payload.recipients);
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
            creditorTaxId: r.creditorTaxId,
            noticeCode: r.token,
          };
          return r;
        }),
      };
      state.isCompleted = true;
    });
    builder.addCase(resetNewNotificationState, () => initialState);
  },
});

export default newNotificationSlice;
