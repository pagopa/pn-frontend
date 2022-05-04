import { createSlice } from '@reduxjs/toolkit';
import {
  PhysicalCommunicationType,
} from '@pagopa-pn/pn-commons';

import { NewNotification, NewNotificationPayment } from '../../models/newNotification';
import { resetNewNotificationState } from './actions';

const initialState = {
  loading: false,
  notification: {
    paNotificationId: '',
    subject: '',
    cancelledIun: '',
    recipients: [],
    documents: [],
    payment: {} as NewNotificationPayment,
    physicalCommunicationType: '' as PhysicalCommunicationType,
    group: ''
  } as NewNotification
};

/* eslint-disable functional/immutable-data */
const newNotificationSlice = createSlice({
  name: 'newNotificationSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetNewNotificationState, () => initialState);
  },
});

export default newNotificationSlice;
