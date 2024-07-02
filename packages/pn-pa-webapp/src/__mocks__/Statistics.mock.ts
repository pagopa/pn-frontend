import { oneMonthAgo, threeMonthsAgo, today } from '@pagopa-pn/pn-commons';

import {
  DeliveryMode,
  DigitaErrorTypes,
  GraphColors,
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
  senderId: 'sender-id',
  genTimestamp: '2024-04-24T11:09:36.432251Z',
  lastDate: '2024-04-21',
  startDate: '2023-12-06',
  endDate: '2024-04-24',
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
  senderId: rawResponseMock.senderId,
  genTimestamp: rawResponseMock.genTimestamp,
  lastDate: rawResponseMock.lastDate,
  startDate: rawResponseMock.startDate,
  endDate: rawResponseMock.endDate,
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
  startDate: '2024-06-17',
  endDate: '2024-06-27',
  data: [
    {
      title: 'Data 1',
      total: 404,
      details: [
        {
          send_date: '2024-06-18',
          count: 75,
        },
        {
          send_date: '2024-06-19',
          count: 60,
        },
        {
          send_date: '2024-06-21',
          count: 121,
        },
        {
          send_date: '2024-06-24',
          count: 41,
        },
        {
          send_date: '2024-06-25',
          count: 89,
        },
        {
          send_date: '2024-06-27',
          count: 18,
        },
      ],
    },
    {
      title: 'Data 2',
      total: 373,
      details: [
        {
          send_date: '2024-06-20',
          count: 72,
        },
        {
          send_date: '2024-06-21',
          count: 39,
        },
        {
          send_date: '2024-06-24',
          count: 168,
        },
        {
          send_date: '2024-06-25',
          count: 83,
        },
        {
          send_date: '2024-06-27',
          count: 11,
        },
      ],
    },
  ],
};

export const trendDataMocked = {
  startDate: '2024-06-17',
  endDate: '2024-06-27',
  lines: [
    {
      title: 'line 1',
      values: [
        {
          send_date: '2024-06-18',
          count: 75,
        },
        {
          send_date: '2024-06-19',
          count: 60,
        },
        {
          send_date: '2024-06-21',
          count: 121,
        },
        {
          send_date: '2024-06-24',
          count: 41,
        },
        {
          send_date: '2024-06-25',
          count: 89,
        },
        {
          send_date: '2024-06-27',
          count: 18,
        },
      ],
    },
    {
      title: 'line 2',
      values: [
        {
          send_date: '2024-06-20',
          count: 72,
        },
        {
          send_date: '2024-06-21',
          count: 39,
        },
        {
          send_date: '2024-06-24',
          count: 168,
        },
        {
          send_date: '2024-06-25',
          count: 83,
        },
        {
          send_date: '2024-06-27',
          count: 11,
        },
      ],
    },
  ],
};

export const dailyTrendForwardedSeriesMock = [
  {
    name: 'line 1',
    type: 'line',
    data: [0, 75, 60, 0, 121, 0, 0, 41, 89, 0, 18],
  },
  {
    name: 'line 2',
    type: 'line',
    data: [0, 0, 0, 72, 39, 0, 0, 168, 83, 0, 11],
  },
];

export const weeklyTrendForwardedSeriesMock = [
  { name: 'line 1', type: 'line', data: [256, 148] },
  { name: 'line 2', type: 'line', data: [111, 262] },
];

type Tuple = [string, string];

export const aggregateDataMock = {
  type: 'pie',
  radius: ['50%', '80%'] as Tuple,
  center: ['50%', '50%'] as Tuple,
  startAngle: 0,
  endAngle: 360,
  values: [
    {
      title: 'Data 1',
      value: 300,
    },
    {
      title: 'Data 2',
      value: 200,
    },
    {
      title: 'Data 3',
      value: 100,
    },
  ],
};

export const aggregateForwardedSeriesMock = {
  type: 'pie',
  radius: ['50%', '80%'],
  center: ['50%', '50%'],
  startAngle: 0,
  endAngle: 360,
  data: [
    {
      name: 'Data 1',
      value: 300,
    },
    {
      name: 'Data 2',
      value: 200,
    },
    {
      name: 'Data 3',
      value: 100,
    },
  ],
};

export const deliveryModeDataMock = {
  startDate: aggregateAndTrendDataMocked.startDate,
  endDate: aggregateAndTrendDataMocked.endDate,
  data: {
    [DeliveryMode.ANALOG]: {
      count: aggregateAndTrendDataMocked.data[0].total,
      details: aggregateAndTrendDataMocked.data[0].details,
    },
    [DeliveryMode.DIGITAL]: {
      count: aggregateAndTrendDataMocked.data[1].total,
      details: aggregateAndTrendDataMocked.data[1].details,
    },
    [DeliveryMode.UNKNOWN]: {
      count: 0,
      details: [],
    },
  },
};

export const deliveryModeDataForwardedMock = {
  ...deliveryModeDataMock,
  data: [
    {
      title: 'delivery_mode.digital',
      total: 373,
      details: [
        { send_date: '2024-06-20', count: 72 },
        { send_date: '2024-06-21', count: 39 },
        { send_date: '2024-06-24', count: 168 },
        { send_date: '2024-06-25', count: 83 },
        { send_date: '2024-06-27', count: 11 },
      ],
    },
    {
      title: 'delivery_mode.analog',
      total: 404,
      details: [
        { send_date: '2024-06-18', count: 75 },
        { send_date: '2024-06-19', count: 60 },
        { send_date: '2024-06-21', count: 121 },
        { send_date: '2024-06-24', count: 41 },
        { send_date: '2024-06-25', count: 89 },
        { send_date: '2024-06-27', count: 18 },
      ],
    },
  ],
  options: { color: [GraphColors.blue, GraphColors.turquoise] },
};

export const digitalErrorsDataMock = {
  data: {
    [DigitaErrorTypes.UNKNOWN]: {
      count: 130,
      attempts: 6,
    },
    [DigitaErrorTypes.DELIVERY_ERROR]: {
      count: 53,
      attempts: 71,
    },
    [DigitaErrorTypes.INVALID_PEC]: {
      count: 13,
      attempts: 23,
    },
    [DigitaErrorTypes.REJECTED]: {
      count: 2,
      attempts: 8,
    },
  },
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

export const digitalErrorsDataForwardedMock = {
  values: [
    {
      title: 'digital_errors_detail.delivery_title',
      description: 'digital_errors_detail.delivery_description',
      value: 53,
      color: GraphColors.lightRed,
    },
    {
      title: 'digital_errors_detail.rejected_title',
      description: 'digital_errors_detail.rejected_description',
      value: 2,
      color: GraphColors.pink,
    },
    {
      title: 'digital_errors_detail.pec_title',
      description: 'digital_errors_detail.pec_description',
      value: 13,
      color: GraphColors.darkRed,
    },
  ],
  options: { color: [GraphColors.lightRed, GraphColors.pink, GraphColors.darkRed] },
  startAngle: 180,
  endAngle: -180,
  radius: ['30%', '90%'],
  center: ['50%', '50%'],
  legend: false,
};

export const digitalMeanTimeDataMock = {
  data: {
    delivered: {
      count: 4108,
      time: 10845.62,
    },
    viewed: {
      count: 2382,
      time: 185361.55,
    },
    refined: {
      count: 4077,
      time: 416877.99,
    },
  },
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

export const digitalMeanTimeDataForwardedMock = [
  { value: 0, itemStyle: { color: GraphColors.lightBlue } },
  { value: 3, itemStyle: { color: GraphColors.lightGreen } },
  { value: 4, itemStyle: { color: GraphColors.darkGreen } },
];

export const digitalStateDataMock = {
  data: {
    [ResponseStatus.OK]: 268,
    [ResponseStatus.KO]: 16,
    [ResponseStatus.PROGRESS]: 32,
    [ResponseStatus.UNKNOWN]: 1,
  },
};

export const digitalStateDataForwardedMock = [
  { value: 268, itemStyle: { color: GraphColors.blue } },
  { value: 16, itemStyle: { color: GraphColors.azure } },
  { value: 32, itemStyle: { color: GraphColors.lightGrey } },
];

export const digitalStateEmptyDataMock = {
  data: {
    [ResponseStatus.OK]: 0,
    [ResponseStatus.KO]: 0,
    [ResponseStatus.PROGRESS]: 0,
    [ResponseStatus.UNKNOWN]: 0,
  },
};

export const filedNotificationsDataMock = {
  startDate: '2024-06-17',
  endDate: '2024-06-22',
  data: {
    [NotificationStatus.ACCEPTED]: {
      count: 124,
      details: [
        { send_date: '2024-06-18', count: 15 },
        { send_date: '2024-06-19', count: 67 },
        { send_date: '2024-06-20', count: 31 },
        { send_date: '2024-06-22', count: 11 },
      ],
    },
    [NotificationStatus.REFUSED]: {
      count: 6,
      details: [
        { send_date: '2024-06-17', count: 1 },
        { send_date: '2024-06-18', count: 3 },
        { send_date: '2024-06-19', count: 0 },
        { send_date: '2024-06-22', count: 2 },
      ],
    },
  },
};

export const filedNotificationsDataForwardedMock = {
  startDate: '2024-06-17',
  endDate: '2024-06-22',
  data: [
    {
      title: 'filed.accepted',
      total: 124,
      details: [
        { send_date: '2024-06-18', count: 15 },
        { send_date: '2024-06-19', count: 67 },
        { send_date: '2024-06-20', count: 31 },
        { send_date: '2024-06-22', count: 11 },
      ],
    },
    {
      title: 'filed.refused',
      total: 6,
      details: [
        { send_date: '2024-06-17', count: 1 },
        { send_date: '2024-06-18', count: 3 },
        { send_date: '2024-06-19', count: 0 },
        { send_date: '2024-06-22', count: 2 },
      ],
    },
  ],
  options: { color: [GraphColors.blue, GraphColors.gold] },
};

export const lastStateDataMock = {
  [NotificationStatus.ACCEPTED]: 0,
  [NotificationStatus.REFUSED]: 41,
  [NotificationStatus.DELIVERING]: 5221,
  [NotificationStatus.DELIVERED]: 1913,
  [NotificationStatus.VIEWED]: 3320,
  [NotificationStatus.EFFECTIVE_DATE]: 8703,
  [NotificationStatus.CANCELLED]: 0,
  [NotificationStatus.UNREACHABLE]: 747,
};

export const lastStateDataForwardedMock = [
  { value: 5221, itemStyle: { color: GraphColors.lightGrey } },
  { value: 1913, itemStyle: { color: GraphColors.lightBlue } },
  { value: 3320, itemStyle: { color: GraphColors.lightGreen } },
  { value: 8703, itemStyle: { color: GraphColors.darkGreen } },
  { value: 0, itemStyle: { color: GraphColors.gold } },
  { value: 747, itemStyle: { color: GraphColors.lightRed } },
];

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
