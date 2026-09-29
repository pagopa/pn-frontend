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

import {
  BffFullSentInformalNotificationTimelineV1,
  BffFullSentInformalNotificationV1,
  InformalNotificationStatusV1,
} from '../../generated-client/informal-notifications';
import {
  getDowntimeHistory,
  getSentInformalNotification,
  getSentInformalNotificationTimeline,
  getSentNotification,
  getSentNotificationTimeline,
} from './actions';

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
  informalNotification: {
    iun: '',
    senderDenomination: '',
    recipients: [],
    subject: '',
    notificationStatus: '' as InformalNotificationStatusV1,
  } as BffFullSentInformalNotificationV1,
  notificationTimeline: {
    iun: '',
    subject: '',
    recipients: [],
    isCancelled: false,
    notificationStatusHistory: [],
  } as NotificationTimelineResponse,
  informalNotificationTimeline: {
    iun: '',
    recipients: [],
    notificationStatusHistory: [],
    communicationOutcomes: {
      delivered: undefined,
      viewed: undefined,
    },
  } as BffFullSentInformalNotificationTimelineV1,
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
    builder.addCase(getSentInformalNotification.fulfilled, (state, action) => {
      state.informalNotification = action.payload;
    });
    builder.addCase(getSentInformalNotificationTimeline.fulfilled, (state, action) => {
      state.informalNotificationTimeline = action.payload;
    });
  },
});

export const { resetState } = notificationSlice.actions;

export default notificationSlice;
