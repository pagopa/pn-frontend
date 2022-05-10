import { createSlice } from '@reduxjs/toolkit';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from '../../models/newNotification';
import { formatNotificationRecipients } from '../../utils/notification.utility';
import { resetNewNotificationState, setPreliminaryInformations, saveRecipients } from './actions';

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
    builder.addCase(setPreliminaryInformations, (state, action) => {
      state.notification = {...state.notification, ...action.payload};
    });
    builder.addCase(resetNewNotificationState, () => initialState);
    builder.addCase(saveRecipients, (state, action) => {
      state.notification.recipients = formatNotificationRecipients(action.payload.recipients);
    });
  },
});

export default newNotificationSlice;
