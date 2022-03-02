import { createSlice } from '@reduxjs/toolkit';

import { NotificationStatus } from '../dashboard/types';
import { NotificationDetail, NotificationDetailDocument, NotificationDetailPayment, NotificationDetailRecipient, NotificationDetailTimeline, NotificationStatusHistory, PhysicalCommunicationType } from './types';
import { getSentNotification, getSentNotificationDocument } from './actions';

/* eslint-disable functional/immutable-data */
const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState: {
    loading: false,
    notification: {
      iun: '',
      paNotificationId: '',
      subject: '',
      sentAt: '',
      cancelledIun: '',
      cancelledByIun: '',
      recipients: [] as Array<NotificationDetailRecipient>,
      documents: [] as Array<NotificationDetailDocument>,
      payment: {} as NotificationDetailPayment,
      notificationStatus: '' as NotificationStatus,
      notificationStatusHistory: [] as Array<NotificationStatusHistory>,
      timeline: [] as Array<NotificationDetailTimeline>,
      physicalCommunicationType: '' as PhysicalCommunicationType
    } as NotificationDetail,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSentNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
    builder.addCase(getSentNotificationDocument.fulfilled, (_state, action) => {
      console.log(action.payload);
    });
  },
});

export default notificationSlice;
