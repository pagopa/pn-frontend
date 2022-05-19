import { createSlice } from '@reduxjs/toolkit';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from '../../models/newNotification';
import { formatNotificationRecipients } from '../../utils/notification.utility';
import { resetNewNotificationState, setCancelledIun, setPreliminaryInformations, uploadNotificationDocument, saveRecipients } from './actions';

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
    paymentMode: '' as PaymentModel
  } as NewNotificationFe
};

/* eslint-disable functional/immutable-data */
const newNotificationSlice = createSlice({
  name: 'newNotificationSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCancelledIun, (state, action) => {
      state.notification = {...state.notification, cancelledIun: action.payload};
    });
    builder.addCase(setPreliminaryInformations, (state, action) => {
      state.notification = {...state.notification, ...action.payload};
    });
    builder.addCase(saveRecipients, (state, action) => {
      state.notification.recipients = formatNotificationRecipients(action.payload.recipients);
    });
    builder.addCase(uploadNotificationDocument.fulfilled, (state, action) => {
      state.notification = {...state.notification, documents: action.payload};
    });
    builder.addCase(resetNewNotificationState, () => initialState);
  },
});

export default newNotificationSlice;
