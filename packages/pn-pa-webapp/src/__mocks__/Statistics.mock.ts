import { NotificationStatus, oneMonthAgo, threeMonthsAgo, today } from '@pagopa-pn/pn-commons';

import {
  DigitaErrorTypes,
  SelectedStatisticsFilter,
  StatisticsDataTypes,
  StatisticsDeliveryMode,
  StatisticsFilter,
  StatisticsParsedResponse,
  StatisticsResponse,
  StatisticsResponseStatus,
} from '../models/Statistics';

const baseDate = threeMonthsAgo.toISOString();
const dateYearMonth = baseDate.substring(0, 7);

export const rawResponseMock: StatisticsResponse = {
  senderId: 'sender-id',
  genTimestamp: `${dateYearMonth}-24T11:09:36.432251Z`,
  lastDate: `${dateYearMonth}-21`,
  startDate: baseDate,
  endDate: `${dateYearMonth}-24`,
  notificationsOverview: [
    {
      notification_send_date: `${dateYearMonth}-15`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERED,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-15`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERED,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-15`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERING,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-15`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-15`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-15`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.VIEWED,
      notification_type: StatisticsDeliveryMode.DIGITAL,
      status_digital_delivery: StatisticsResponseStatus.OK,
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
      notification_send_date: `${dateYearMonth}-18`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERED,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-18`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.DELIVERING,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-18`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-18`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: StatisticsDeliveryMode.ANALOG,
      status_digital_delivery: StatisticsResponseStatus.UNKNOWN,
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
      notification_send_date: `${dateYearMonth}-18`,
      notification_request_status: NotificationStatus.ACCEPTED,
      notification_status: NotificationStatus.EFFECTIVE_DATE,
      notification_type: StatisticsDeliveryMode.DIGITAL,
      status_digital_delivery: StatisticsResponseStatus.OK,
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
      notification_send_date: `${dateYearMonth}-15`,
      error_type: DigitaErrorTypes.DELIVERY_ERROR,
      failed_attempts_count: 11,
      notifications_count: 4,
    },
    {
      notification_send_date: `${dateYearMonth}-15`,
      error_type: DigitaErrorTypes.UNKNOWN,
      failed_attempts_count: 0,
      notifications_count: 234,
    },
    {
      notification_send_date: `${dateYearMonth}-18`,
      error_type: DigitaErrorTypes.INVALID_PEC,
      failed_attempts_count: 7,
      notifications_count: 4,
    },
    {
      notification_send_date: `${dateYearMonth}-18`,
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
          { send_date: `${dateYearMonth}-15`, count: 920 },
          { send_date: `${dateYearMonth}-18`, count: 882 },
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
      [NotificationStatus.RETURNED_TO_SENDER]: 0,
    },
    [StatisticsDataTypes.DeliveryModeStatistics]: {
      [StatisticsDeliveryMode.ANALOG]: {
        count: 1591,
        details: [
          { send_date: `${dateYearMonth}-15`, count: 788 },
          { send_date: `${dateYearMonth}-18`, count: 803 },
        ],
      },
      [StatisticsDeliveryMode.DIGITAL]: {
        count: 211,
        details: [
          { send_date: `${dateYearMonth}-15`, count: 132 },
          { send_date: `${dateYearMonth}-18`, count: 79 },
        ],
      },
      [StatisticsDeliveryMode.UNKNOWN]: {
        count: 0,
        details: [],
      },
    },
    [StatisticsDataTypes.DigitalStateStatistics]: {
      [StatisticsResponseStatus.OK]: 211,
      [StatisticsResponseStatus.KO]: 0,
      [StatisticsResponseStatus.PROGRESS]: 0,
      [StatisticsResponseStatus.UNKNOWN]: 0,
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
      [DigitaErrorTypes.MALFORMED_PEC_ADDRESS]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.SENDING_PEC]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.SERVER_PEC_COMUNICATION]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.VIRUS_DETECTED]: { count: 0, attempts: 0 },
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
      [NotificationStatus.RETURNED_TO_SENDER]: 0,
    },
    [StatisticsDataTypes.DeliveryModeStatistics]: {
      [StatisticsDeliveryMode.ANALOG]: {
        count: 0,
        details: [],
      },
      [StatisticsDeliveryMode.DIGITAL]: {
        count: 0,
        details: [],
      },
      [StatisticsDeliveryMode.UNKNOWN]: {
        count: 0,
        details: [],
      },
    },
    [StatisticsDataTypes.DigitalStateStatistics]: {
      [StatisticsResponseStatus.OK]: 0,
      [StatisticsResponseStatus.KO]: 0,
      [StatisticsResponseStatus.PROGRESS]: 0,
      [StatisticsResponseStatus.UNKNOWN]: 0,
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
      [DigitaErrorTypes.MALFORMED_PEC_ADDRESS]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.SENDING_PEC]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.SERVER_PEC_COMUNICATION]: { count: 0, attempts: 0 },
      [DigitaErrorTypes.VIRUS_DETECTED]: { count: 0, attempts: 0 },
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
    startDate: new Date(`${dateYearMonth}-15`),
    endDate: new Date(`${dateYearMonth}-18`),
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
    [DigitaErrorTypes.VIRUS_DETECTED]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.SERVER_PEC_COMUNICATION]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.SENDING_PEC]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.MALFORMED_PEC_ADDRESS]: {
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
    [StatisticsResponseStatus.OK]: 0,
    [StatisticsResponseStatus.KO]: 0,
    [StatisticsResponseStatus.PROGRESS]: 0,
    [StatisticsResponseStatus.UNKNOWN]: 0,
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
  [NotificationStatus.RETURNED_TO_SENDER]: 0,
};

export const trendDataMocked = {
  startDate: aggregateAndTrendDataMocked.startDate,
  endDate: aggregateAndTrendDataMocked.endDate,
  lines: aggregateAndTrendDataMocked.data.map((data) => ({
    title: data.title,
    values: data.details,
  })),
};
