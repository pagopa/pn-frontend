export enum NotificationStatus {
  ACCEPTED = 'ACCEPTED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  VIEWED = 'VIEWED',
  EFFECTIVE_DATE = 'EFFECTIVE_DATE',
  UNREACHABLE = 'UNREACHABLE',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED',
  IN_VALIDATION = 'IN_VALIDATION',
  PAID = 'PAID',
  CANCELLATION_IN_PROGRESS = 'CANCELLATION_IN_PROGRESS',
}

export enum CxType {
  PA = 'PA',
  PF = 'PF',
  PG = 'PG',
}

export enum DeliveryMode { // export from pn-commons/../NotificationDetail.ts???
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOGIC',
  UNKNOWN = '-',
}

export enum ResponseStatus { // EXPORT FROM pn-commons/../NotificationDetail.ts???
  OK = 'OK',
  PROGRESS = 'IN_CORSO',
  UNKNOWN = '-',
  KO = 'KO',
}

export enum DigitaErrorTypes {
  INVALID_PEC = 'ERRORE DOMICILIO PEC NON VALIDO',
  DELIVERY_ERROR = 'ERRORE CONSEGNA',
  REJECTED = 'NON ACCETTAZIONE',
  UNKNOWN = '-',
}

export enum StatisticsDataTypes {
  FiledStatistics = 'FiledStatistics',
  LastStateStatistics = 'LastStateStatistics',
  DeliveryModeStatistics = 'DeliveryModeStatistics',
  DigitalStateStatistics = 'DigitalStateStatistics',
  DigitalMeanTimeStatistics = 'DigitalMeanTimeStatistics',
  DigitalErrorsDetailStatistics = 'DigitalErrorsDetailStatistics',
  DigitalAttemptsStatistics = 'DigitalAttemptsStatistics',
}

export interface NotificationOverview {
  notification_send_date: string;
  notification_request_status: 'ACCEPTED' | 'REFUSED';
  notification_status: NotificationStatus; // openapi definition does not include the following: IN_VALIDATION, PAID
  notification_type: DeliveryMode;
  status_digital_delivery: ResponseStatus;
  notification_delivered: 'SI' | 'NO';
  notification_viewed: 'SI' | 'NO';
  notification_refined: 'SI' | 'NO';
  attempt_count_per_digital_notification: string | number;
  notifications_count: string | number;
  delivery_time: string | number;
  view_time: string | number;
  refinement_time: string | number;
  validation_time: string | number;
}

export interface DigitalNotificationFocus {
  notification_send_date: string;
  error_type: string;
  failed_attempts_count: string | number;
  notifications_count: string | number;
}

export interface StatisticsResponse {
  sender_id: string;
  genTimestamp: string;
  lastDate: string;
  startDate: string;
  endDate: string;
  notificationsOverview: Array<NotificationOverview>;
  digitalNotificationFocus: Array<DigitalNotificationFocus>;
}

export interface StatisticsParams<TDate extends string | Date> {
  cxType: CxType;
  cxId: string;
  startDate: TDate;
  endDate: TDate;
}

export interface IStatisticsDailySummary {
  send_date: string;
  count: number;
}

export interface IStatisticsTrendData {
  count: number;
  details: Array<IStatisticsDailySummary>;
}

export interface IFiledStatistics {
  [NotificationStatus.ACCEPTED]: IStatisticsTrendData;
  [NotificationStatus.REFUSED]: IStatisticsTrendData;
}

export interface ILastStateStatistics {
  [NotificationStatus.ACCEPTED]: number;
  [NotificationStatus.DELIVERING]: number;
  [NotificationStatus.DELIVERED]: number;
  [NotificationStatus.VIEWED]: number;
  [NotificationStatus.EFFECTIVE_DATE]: number;
  [NotificationStatus.UNREACHABLE]: number;
  [NotificationStatus.CANCELLED]: number;
  [NotificationStatus.REFUSED]: number;
}

export interface IDeliveryModeStatistics {
  [DeliveryMode.ANALOG]: IStatisticsTrendData;
  [DeliveryMode.DIGITAL]: IStatisticsTrendData;
  [DeliveryMode.UNKNOWN]: IStatisticsTrendData;
}

export interface IDigitalStateStatistics {
  [ResponseStatus.OK]: number;
  [ResponseStatus.KO]: number;
  [ResponseStatus.PROGRESS]: number;
  [ResponseStatus.UNKNOWN]: number;
}

interface IProcessTimeStatistics {
  count: number;
  time: number;
}

export interface IDigitalMeanTimeStatistics {
  delivered: IProcessTimeStatistics;
  viewed: IProcessTimeStatistics;
  refined: IProcessTimeStatistics;
}

export interface IAttemptsCount {
  attempts: number;
  count: number;
}

export interface IDigitalErrorsDetailStatistics {
  [DigitaErrorTypes.INVALID_PEC]: IAttemptsCount;
  [DigitaErrorTypes.DELIVERY_ERROR]: IAttemptsCount;
  [DigitaErrorTypes.REJECTED]: IAttemptsCount;
  [DigitaErrorTypes.UNKNOWN]: IAttemptsCount;
}

export interface StatisticsParsedData {
  [StatisticsDataTypes.FiledStatistics]: IFiledStatistics;
  [StatisticsDataTypes.LastStateStatistics]: ILastStateStatistics;
  [StatisticsDataTypes.DeliveryModeStatistics]: IDeliveryModeStatistics;
  [StatisticsDataTypes.DigitalStateStatistics]: IDigitalStateStatistics;
  [StatisticsDataTypes.DigitalMeanTimeStatistics]: IDigitalMeanTimeStatistics;
  [StatisticsDataTypes.DigitalErrorsDetailStatistics]: IDigitalErrorsDetailStatistics;
  [StatisticsDataTypes.DigitalAttemptsStatistics]: Array<IAttemptsCount>;
}

export interface StatisticsParsedResponse {
  sender_id: string;
  genTimestamp: string;
  lastDate: string;
  startDate: string;
  endDate: string;
  data: StatisticsParsedData;
}

export enum Timeframe {
  daily = 'daily',
  weekly = 'weekly',
}

export enum WEEK_DAYS {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export const SelectedStatisticsFilter = {
  lastMonth: 'lastMonth',
  last3Months: 'last3Months',
  last6Months: 'last6Months',
  last12Months: 'last12Months',
  custom: 'custom',
} as const;

export type SelectedStatisticsFilterKeys =
  typeof SelectedStatisticsFilter[keyof typeof SelectedStatisticsFilter];

export type StatisticsFilter = {
  selected: SelectedStatisticsFilterKeys | null;
  startDate: Date;
  endDate: Date;
};
