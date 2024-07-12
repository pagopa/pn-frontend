import { oneMonthAgo, threeMonthsAgo, today } from '@pagopa-pn/pn-commons';

import {
  DeliveryMode,
  DigitaErrorTypes,
  NotificationStatus,
  ResponseStatus,
  SelectedStatisticsFilter,
  StatisticsDataTypes,
  StatisticsFilter,
  StatisticsParsedResponse,
  StatisticsResponse,
} from '../models/Statistics';

export const rawResponseMock: StatisticsResponse = {
  senderId: 'sender-id',
  genTimestamp: '2024-04-24T11:09:36.432251Z',
  lastDate: '2024-04-21',
  startDate: '2023-12-06',
  endDate: '2024-04-24',
  notificationsOverview: [
    {
      notification_send_date: '2024-03-15',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERED,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'SI',
      notification_viewed: 'NO',
      notification_refined: 'NO',
      attempt_count_per_digital_notification: 0,
      notifications_count: 49,
      delivery_time: 35419.6,
      view_time: 0.0,
      refinement_time: 0.0,
      validation_time: 2.77,
    },
    {
      notification_send_date: '2024-03-15',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERED,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'NO',
      notification_viewed: 'NO',
      notification_refined: 'NO',
      attempt_count_per_digital_notification: 0,
      notifications_count: 4,
      delivery_time: 0.0,
      view_time: 0.0,
      refinement_time: 0.0,
      validation_time: 0.11,
    },
    {
      notification_send_date: '2024-03-15',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERING,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'NO',
      notification_viewed: 'NO',
      notification_refined: 'NO',
      attempt_count_per_digital_notification: 0,
      notifications_count: 38,
      delivery_time: 0.0,
      view_time: 0.0,
      refinement_time: 0.0,
      validation_time: 67.24,
    },
    {
      notification_send_date: '2024-03-15',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'SI',
      notification_viewed: 'NO',
      notification_refined: 'SI',
      attempt_count_per_digital_notification: 0,
      notifications_count: 564,
      delivery_time: 257041.82,
      view_time: 0.0,
      refinement_time: 345965.16,
      validation_time: 31.62,
    },
    {
      notification_send_date: '2024-03-15',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'NO',
      notification_viewed: 'NO',
      notification_refined: 'SI',
      attempt_count_per_digital_notification: 0,
      notifications_count: 133,
      delivery_time: 0.0,
      view_time: 0.0,
      refinement_time: 83487.85,
      validation_time: 7.63,
    },
    {
      notification_send_date: '2024-03-15',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.VIEWED,
      notification_type: DeliveryMode.DIGITAL,
      status_digital_delivery: ResponseStatus.OK,
      notification_delivered: 'SI',
      notification_viewed: 'SI',
      notification_refined: 'SI',
      attempt_count_per_digital_notification: 0,
      notifications_count: 132,
      delivery_time: 28.9,
      view_time: 14949.64,
      refinement_time: 8904.52,
      validation_time: 7.23,
    },
    {
      notification_send_date: '2024-03-18',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERED,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'SI',
      notification_viewed: 'NO',
      notification_refined: 'NO',
      attempt_count_per_digital_notification: 0,
      notifications_count: 54,
      delivery_time: 37194.88,
      view_time: 0.0,
      refinement_time: 0.0,
      validation_time: 8.47,
    },
    {
      notification_send_date: '2024-03-18',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERING,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'NO',
      notification_viewed: 'NO',
      notification_refined: 'NO',
      attempt_count_per_digital_notification: 0,
      notifications_count: 41,
      delivery_time: 0.0,
      view_time: 0.0,
      refinement_time: 0.0,
      validation_time: 1.95,
    },
    {
      notification_send_date: '2024-03-18',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'SI',
      notification_viewed: 'NO',
      notification_refined: 'SI',
      attempt_count_per_digital_notification: 0,
      notifications_count: 574,
      delivery_time: 216403.54,
      view_time: 0.0,
      refinement_time: 311443.92,
      validation_time: 40.56,
    },
    {
      notification_send_date: '2024-03-18',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: DeliveryMode.ANALOG,
      status_digital_delivery: ResponseStatus.UNKNOWN,
      notification_delivered: 'NO',
      notification_viewed: 'NO',
      notification_refined: 'SI',
      attempt_count_per_digital_notification: 0,
      notifications_count: 134,
      delivery_time: 0.0,
      view_time: 0.0,
      refinement_time: 74775.4,
      validation_time: 7.1,
    },
    {
      notification_send_date: '2024-03-18',
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: DeliveryMode.DIGITAL,
      status_digital_delivery: ResponseStatus.OK,
      notification_delivered: 'SI',
      notification_viewed: 'NO',
      notification_refined: 'SI',
      attempt_count_per_digital_notification: 0,
      notifications_count: 79,
      delivery_time: 16.77,
      view_time: 0.0,
      refinement_time: 13292.18,
      validation_time: 4.13,
    },
  ],
  digitalNotificationFocus: [
    {
      notification_send_date: '2024-03-15',
      error_type: DigitaErrorTypes.DELIVERY_ERROR,
      failed_attempts_count: 11,
      notifications_count: 4,
    },
    {
      notification_send_date: '2024-03-15',
      error_type: DigitaErrorTypes.UNKNOWN,
      failed_attempts_count: 0,
      notifications_count: 234,
    },
    {
      notification_send_date: '2024-03-18',
      error_type: DigitaErrorTypes.INVALID_PEC,
      failed_attempts_count: 7,
      notifications_count: 4,
    },
    {
      notification_send_date: '2024-03-18',
      error_type: DigitaErrorTypes.UNKNOWN,
      failed_attempts_count: 0,
      notifications_count: 227,
    },
  ],
};
export const rawEmptyResponseMock: StatisticsResponse = {
  ...rawResponseMock,
  notificationsOverview: [],
  digitalNotificationFocus: [],
};

export const parsedResponseMock: StatisticsParsedResponse = {
  senderId: rawResponseMock.senderId,
  genTimestamp: rawResponseMock.genTimestamp,
  lastDate: rawResponseMock.lastDate,
  startDate: rawResponseMock.startDate,
  endDate: rawResponseMock.endDate,
  data: {
    [StatisticsDataTypes.FiledStatistics]: {
      [NotificationStatus.ACCEPTED]: {
        count: 1802,
        details: [
          { send_date: '2024-03-15', count: 920 },
          { send_date: '2024-03-18', count: 882 },
        ],
      },
      [NotificationStatus.REFUSED]: { count: 0, details: [] },
    },
    [StatisticsDataTypes.LastStateStatistics]: {
      [NotificationStatus.ACCEPTED]: 0,
      [NotificationStatus.REFUSED]: 0,
      [NotificationStatus.DELIVERING]: 79,
      [NotificationStatus.DELIVERED]: 107,
      [NotificationStatus.VIEWED]: 132,
      [NotificationStatus.EFFECTIVE_DATE]: 1484,
      [NotificationStatus.CANCELLED]: 0,
      [NotificationStatus.UNREACHABLE]: 0,
    },
    [StatisticsDataTypes.DeliveryModeStatistics]: {
      [DeliveryMode.ANALOG]: {
        count: 1591,
        details: [
          { send_date: '2024-03-15', count: 788 },
          { send_date: '2024-03-18', count: 803 },
        ],
      },
      [DeliveryMode.DIGITAL]: {
        count: 211,
        details: [
          { send_date: '2024-03-15', count: 132 },
          { send_date: '2024-03-18', count: 79 },
        ],
      },
      [DeliveryMode.UNKNOWN]: {
        count: 0,
        details: [],
      },
    },
    [StatisticsDataTypes.DigitalStateStatistics]: {
      [ResponseStatus.OK]: 211,
      [ResponseStatus.KO]: 0,
      [ResponseStatus.PROGRESS]: 0,
      [ResponseStatus.UNKNOWN]: 0,
    },
    [StatisticsDataTypes.DigitalMeanTimeStatistics]: {
      delivered: { count: 211, time: 45.67 },
      viewed: { count: 132, time: 14949.64 },
      refined: { count: 211, time: 22196.7 },
    },
    [StatisticsDataTypes.DigitalErrorsDetailStatistics]: {
      [DigitaErrorTypes.INVALID_PEC]: { count: 4, attempts: 7 },
      [DigitaErrorTypes.DELIVERY_ERROR]: { count: 4, attempts: 11 },
      [DigitaErrorTypes.REJECTED]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.UNKNOWN]: { count: 461, attempts: 0 },
    },
  },
};

export const parsedEmptyResponseMock: StatisticsParsedResponse = {
  ...parsedResponseMock,
  data: {
    [StatisticsDataTypes.FiledStatistics]: {
      [NotificationStatus.ACCEPTED]: {
        count: 0,
        details: [],
      },
      [NotificationStatus.REFUSED]: { count: 0, details: [] },
    },
    [StatisticsDataTypes.LastStateStatistics]: {
      [NotificationStatus.ACCEPTED]: 0,
      [NotificationStatus.REFUSED]: 0,
      [NotificationStatus.DELIVERING]: 0,
      [NotificationStatus.DELIVERED]: 0,
      [NotificationStatus.VIEWED]: 0,
      [NotificationStatus.EFFECTIVE_DATE]: 0,
      [NotificationStatus.CANCELLED]: 0,
      [NotificationStatus.UNREACHABLE]: 0,
    },
    [StatisticsDataTypes.DeliveryModeStatistics]: {
      [DeliveryMode.ANALOG]: {
        count: 0,
        details: [],
      },
      [DeliveryMode.DIGITAL]: {
        count: 0,
        details: [],
      },
      [DeliveryMode.UNKNOWN]: {
        count: 0,
        details: [],
      },
    },
    [StatisticsDataTypes.DigitalStateStatistics]: {
      [ResponseStatus.OK]: 0,
      [ResponseStatus.KO]: 0,
      [ResponseStatus.PROGRESS]: 0,
      [ResponseStatus.UNKNOWN]: 0,
    },
    [StatisticsDataTypes.DigitalMeanTimeStatistics]: {
      delivered: { count: 0, time: 0 },
      viewed: { count: 0, time: 0 },
      refined: { count: 0, time: 0 },
    },
    [StatisticsDataTypes.DigitalErrorsDetailStatistics]: {
      [DigitaErrorTypes.INVALID_PEC]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.DELIVERY_ERROR]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.REJECTED]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.UNKNOWN]: { count: 0, attempts: 0 },
    },
  },
};

export const filters: Array<StatisticsFilter> = [
  {
    selected: SelectedStatisticsFilter.lastMonth,
    startDate: oneMonthAgo,
    endDate: today,
  },
  {
    selected: SelectedStatisticsFilter.last3Months,
    startDate: threeMonthsAgo,
    endDate: today,
  },
  {
    selected: SelectedStatisticsFilter.custom,
    startDate: new Date('2023-08-26'),
    endDate: new Date('2024-06-22'),
  },
];

export const aggregateAndTrendDataMocked = {
  startDate: parsedResponseMock.startDate,
  endDate: parsedResponseMock.endDate,
  data: [
    {
      title: 'accepted',
      total:
        parsedResponseMock.data[StatisticsDataTypes.FiledStatistics][NotificationStatus.ACCEPTED]
          .count,
      details:
        parsedResponseMock.data[StatisticsDataTypes.FiledStatistics][NotificationStatus.ACCEPTED]
          .details,
    },
    {
      title: 'refused',
      total:
        parsedResponseMock.data[StatisticsDataTypes.FiledStatistics][NotificationStatus.REFUSED]
          .count,
      details:
        parsedResponseMock.data[StatisticsDataTypes.FiledStatistics][NotificationStatus.REFUSED]
          .details,
    },
  ],
};

export const aggregateDataMock = {
  type: 'pie',
  radius: ['50%', '80%'] as [string, string],
  center: ['50%', '50%'] as [string, string],
  startAngle: 0,
  endAngle: 360,
  values: aggregateAndTrendDataMocked.data.map((data) => ({
    title: data.title,
    value: data.total,
  })),
};

export const deliveryModeDataMock = {
  startDate: parsedResponseMock.startDate,
  endDate: parsedResponseMock.endDate,
  data: parsedResponseMock.data[StatisticsDataTypes.DeliveryModeStatistics],
};

export const digitalErrorsDataMock = {
  data: parsedResponseMock.data[StatisticsDataTypes.DigitalErrorsDetailStatistics],
};

export const digitalErrorsEmptyDataMock = {
  data: {
    [DigitaErrorTypes.UNKNOWN]: {
      count: 130,
      attempts: 6,
    },
    [DigitaErrorTypes.DELIVERY_ERROR]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.INVALID_PEC]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.REJECTED]: {
      count: 0,
      attempts: 0,
    },
  },
};

export const digitalMeanTimeDataMock = {
  data: parsedResponseMock.data[StatisticsDataTypes.DigitalMeanTimeStatistics],
};

export const digitalMeanTimeEmptyDataMock = {
  data: {
    delivered: {
      count: 0,
      time: 0,
    },
    viewed: {
      count: 0,
      time: 0,
    },
    refined: {
      count: 0,
      time: 0,
    },
  },
};

export const digitalStateDataMock = {
  data: parsedResponseMock.data[StatisticsDataTypes.DigitalStateStatistics],
};

export const digitalStateEmptyDataMock = {
  data: {
    [ResponseStatus.OK]: 0,
    [ResponseStatus.KO]: 0,
    [ResponseStatus.PROGRESS]: 0,
    [ResponseStatus.UNKNOWN]: 0,
  },
};

export const filedNotificationsDataMock = {
  startDate: parsedResponseMock.startDate,
  endDate: parsedResponseMock.endDate,
  data: parsedResponseMock.data[StatisticsDataTypes.FiledStatistics],
};

export const lastStateDataMock = parsedResponseMock.data[StatisticsDataTypes.LastStateStatistics];

export const lastStateEmptyDataMock = {
  [NotificationStatus.ACCEPTED]: 0,
  [NotificationStatus.REFUSED]: 0,
  [NotificationStatus.DELIVERING]: 0,
  [NotificationStatus.DELIVERED]: 0,
  [NotificationStatus.VIEWED]: 0,
  [NotificationStatus.EFFECTIVE_DATE]: 0,
  [NotificationStatus.CANCELLED]: 0,
  [NotificationStatus.UNREACHABLE]: 0,
};

export const trendDataMocked = {
  startDate: aggregateAndTrendDataMocked.startDate,
  endDate: aggregateAndTrendDataMocked.endDate,
  lines: aggregateAndTrendDataMocked.data.map((data) => ({
    title: data.title,
    values: data.details,
  })),
};
