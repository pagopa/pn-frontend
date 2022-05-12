import { createSlice } from '@reduxjs/toolkit';
import {
  PhysicalCommunicationType,
} from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from '../../models/newNotification';
import { resetNewNotificationState, setPreliminaryInformations, uploadNotificationDocument } from './actions';

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
    builder.addCase(uploadNotificationDocument.fulfilled, (state, action) => {
      state.notification = {...state.notification, documents: action.payload};
    });
    builder.addCase(resetNewNotificationState, () => initialState);
  },
});

export default newNotificationSlice;
