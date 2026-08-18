import {
  Downtime,
  INotificationDetailTimeline,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
  NotificationTimelineResponse,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

import { getDowntimeHistory, getSentNotification, getSentNotificationTimeline } from './actions';

const initialState = {
  loading: false,
  notification: {
    subject: '',
    recipients: [] as Array<NotificationDetailRecipient>,
    documents: [] as Array<NotificationDetailDocument>,
    otherDocuments: [] as Array<NotificationDetailOtherDocument>,
    iun: '',
    sentAt: '',
    notificationStatus: '' as NotificationStatus,
    notificationStatusHistory: [] as Array<NotificationStatusHistory>,
    timeline: [] as Array<INotificationDetailTimeline>,
  } as NotificationDetail,
  notificationTimeline: {
    iun: '',
    subject: '',
    recipients: [],
    notificationStatusHistory: [],
  } as NotificationTimelineResponse,
  downtimeEvents: [] as Array<Downtime>,
};

/* eslint-disable functional/immutable-data */
const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getSentNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
    builder.addCase(getSentNotificationTimeline.fulfilled, (state, action) => {
      state.notificationTimeline = action.payload;
    });
    builder.addCase(getDowntimeHistory.fulfilled, (state, action) => {
      state.downtimeEvents = action.payload.result;
    });
  },
});

export const { resetState } = notificationSlice.actions;

export default notificationSlice;
