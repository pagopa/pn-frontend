import {
  getNotificationStatusLabelAndColor,
  NotificationDetailTimeline,
  NotificationStatus,
  NotificationStatusHistory,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import { getNotificationStatusLabelAndColorFromTimelineCategory } from '../status.utility';

const notificationStatusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-1'],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-2'],
  },
  {
    status: NotificationStatus.REFUSED,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-3'],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-4'],
  },
  {
    status: NotificationStatus.UNREACHABLE,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-5'],
  },
  {
    status: NotificationStatus.PAID,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-6'],
  },
  {
    status: NotificationStatus.IN_VALIDATION,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-7'],
  },
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-8'],
  },
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-9'],
  },
  {
    status: NotificationStatus.CANCELED,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-10'],
  },
];

const timelineStep: NotificationDetailTimeline = {
  elementId: '',
  timestamp: '',
  category: TimelineCategory.ANALOG_FAILURE_WORKFLOW,
  details: {
    category: TimelineCategory.ANALOG_FAILURE_WORKFLOW,
    taxdId: '',
  },
};

test('return timeline step data - ACCEPTED', () => {
  timelineStep.elementId = 'mocked-timeline-id-1';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.ACCEPTED);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - DELIVERED', () => {
  timelineStep.elementId = 'mocked-timeline-id-2';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.DELIVERED);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - REFUSED', () => {
  timelineStep.elementId = 'mocked-timeline-id-3';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.REFUSED);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - DELIVERING', () => {
  timelineStep.elementId = 'mocked-timeline-id-4';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.DELIVERING);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - UNREACHABLE', () => {
  timelineStep.elementId = 'mocked-timeline-id-5';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.UNREACHABLE);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - PAID', () => {
  timelineStep.elementId = 'mocked-timeline-id-6';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.PAID);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - IN_VALIDATION', () => {
  timelineStep.elementId = 'mocked-timeline-id-7';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.IN_VALIDATION);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - EFFECTIVE_DATE', () => {
  timelineStep.elementId = 'mocked-timeline-id-8';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.EFFECTIVE_DATE);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - VIEWED', () => {
  timelineStep.elementId = 'mocked-timeline-id-9';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.VIEWED);
  expect(timeLineData).toStrictEqual(notificationData);
});

test('return timeline step data - CANCELED', () => {
  timelineStep.elementId = 'mocked-timeline-id-10';
  const timeLineData = getNotificationStatusLabelAndColorFromTimelineCategory(
    timelineStep,
    notificationStatusHistory
  );
  const notificationData = getNotificationStatusLabelAndColor(NotificationStatus.CANCELED);
  expect(timeLineData).toStrictEqual(notificationData);
});
