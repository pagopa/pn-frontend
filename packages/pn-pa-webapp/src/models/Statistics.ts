import { NotificationStatus } from '@pagopa-pn/pn-commons';

export enum GraphColors {
  navy = '#0073E6',
  greyBlue = '#5C6F82',
  lightBlue2 = 'rgba(196, 220, 245, 0.61)', // '#C4DCF5',
  blue = '#0055AA',
  gold = '#FFCB46',
  lightGrey = '#E0E0E0',
  lightBlue = '#6BCFFB',
  lightGreen = '#6CC66A',
  darkGreen = '#5CA85A',
  lightRed = '#FE6666',
  turquoise = '#21CDD1',
  azure = '#00C5CA',
  pink = '#FB9EAC',
  darkRed = '#761F1F',
  lightYellow = '#FFE5A3',
  goldenYellow = '#D9AD3C',
  oliveBrown = '#614C15',
}

export enum CxType {
  PA = 'PA',
  PF = 'PF',
  PG = 'PG',
}

export enum StatisticsDeliveryMode {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOGIC',
  UNKNOWN = '-',
}

export enum StatisticsResponseStatus {
  OK = 'OK',
  PROGRESS = 'IN_CORSO',
  UNKNOWN = '-',
  KO = 'KO',
}

export enum DigitaErrorTypes {
  REJECTED = 'NON ACCETTAZIONE',
  DELIVERY_ERROR = 'ERRORE CONSEGNA',
  VIRUS_DETECTED = 'RILEVAZIONE VIRUS',
  SERVER_PEC_COMUNICATION = 'ERRORE COMUNICAZIONE SERVER PEC',
  SENDING_PEC = 'ERRORE INVIO PEC',
  INVALID_PEC = 'ERRORE DOMINIO PEC NON VALIDO',
  MALFORMED_PEC_ADDRESS = 'ERRORE INDIRIZZO PEC MALFORMATO',
  UNKNOWN = 'NON DEFINITO',
}

export enum StatisticsDataTypes {
  FiledStatistics = 'FiledStatistics',
  LastStateStatistics = 'LastStateStatistics',
  DeliveryModeStatistics = 'DeliveryModeStatistics',
  DigitalStateStatistics = 'DigitalStateStatistics',
  DigitalMeanTimeStatistics = 'DigitalMeanTimeStatistics',
  DigitalErrorsDetailStatistics = 'DigitalErrorsDetailStatistics',
}

export interface NotificationOverview {
  notification_send_date: string;
  notification_request_status: 'ACCEPTED' | 'REFUSED' | '-';
  notification_status: NotificationStatus; // openapi definition does not include the following: IN_VALIDATION, PAID
  notification_type: StatisticsDeliveryMode;
  status_digital_delivery: StatisticsResponseStatus;
  notification_delivered: 'SI' | 'NO' | '-';
  notification_viewed: 'SI' | 'NO' | '-';
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
  senderId: string;
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
  [NotificationStatus.RETURNED_TO_SENDER]: number;
}

export interface IDeliveryModeStatistics {
  [StatisticsDeliveryMode.ANALOG]: IStatisticsTrendData;
  [StatisticsDeliveryMode.DIGITAL]: IStatisticsTrendData;
  [StatisticsDeliveryMode.UNKNOWN]: IStatisticsTrendData;
}

export interface IDigitalStateStatistics {
  [StatisticsResponseStatus.OK]: number;
  [StatisticsResponseStatus.KO]: number;
  [StatisticsResponseStatus.PROGRESS]: number;
  [StatisticsResponseStatus.UNKNOWN]: number;
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
  [DigitaErrorTypes.REJECTED]: IAttemptsCount;
  [DigitaErrorTypes.DELIVERY_ERROR]: IAttemptsCount;
  [DigitaErrorTypes.VIRUS_DETECTED]: IAttemptsCount;
  [DigitaErrorTypes.SERVER_PEC_COMUNICATION]: IAttemptsCount;
  [DigitaErrorTypes.SENDING_PEC]: IAttemptsCount;
  [DigitaErrorTypes.INVALID_PEC]: IAttemptsCount;
  [DigitaErrorTypes.MALFORMED_PEC_ADDRESS]: IAttemptsCount;
  [DigitaErrorTypes.UNKNOWN]: IAttemptsCount;
}

export interface StatisticsParsedData {
  [StatisticsDataTypes.FiledStatistics]: IFiledStatistics;
  [StatisticsDataTypes.LastStateStatistics]: ILastStateStatistics;
  [StatisticsDataTypes.DeliveryModeStatistics]: IDeliveryModeStatistics;
  [StatisticsDataTypes.DigitalStateStatistics]: IDigitalStateStatistics;
  [StatisticsDataTypes.DigitalMeanTimeStatistics]: IDigitalMeanTimeStatistics;
  [StatisticsDataTypes.DigitalErrorsDetailStatistics]: IDigitalErrorsDetailStatistics;
}

export interface StatisticsParsedResponse {
  senderId: string;
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
  last12Months: 'last12Months',
  last6Months: 'last6Months',
  last3Months: 'last3Months',
  lastMonth: 'lastMonth',
  custom: 'custom',
} as const;

export type SelectedStatisticsFilterKeys =
  (typeof SelectedStatisticsFilter)[keyof typeof SelectedStatisticsFilter];

export type StatisticsFilter = {
  selected: SelectedStatisticsFilterKeys | null;
  startDate: Date;
  endDate: Date;
};
