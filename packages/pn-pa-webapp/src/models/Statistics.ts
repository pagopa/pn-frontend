export enum NotificationStatus {
  ACCEPTED = 'ACCEPTED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  VIEWED = 'VIEWED',
  EFFECTIVE_DATE = 'EFFECTIVE_DATE',
  UNREACHABLE = 'UNREACHABLE',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED',
}

export enum DeliveryMode { // export from pn-commons/../NotificationDetail.ts???
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOGIC ',
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

export interface NotificationOverview {
  notification_send_date: string;
  notification_request_status: NotificationStatus.ACCEPTED | NotificationStatus.REFUSED;
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
  error_type: DigitaErrorTypes;
  failed_attempts_count: string | number;
  notifications_count: string | number;
}

export interface StatisticsResponse {
  sender_id: string;
  genTimestamp: string;
  lastDate: string;
  startDate: string;
  endDate: string;
  notifications_overview: Array<NotificationOverview>;
  digital_notification_focus: Array<DigitalNotificationFocus>;
}

export interface StatisticsParams<TDate extends string | Date> {
  cxId: string;
  startDate: TDate;
  endDate: TDate;
}

interface IStatisticsDailySummary {
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

export interface NormalizedStatisticsResponse {
  sender_id: string;
  genTimestamp: string;
  lastDate: string;
  startDate: string;
  endDate: string;
  by_request_status: IFiledStatistics;
  by_status: ILastStateStatistics;
  by_delivery_mode: IDeliveryModeStatistics;
  by_digital_delivery_status: IDigitalStateStatistics;
  time_by_digital_status: IDigitalMeanTimeStatistics;
  digital_errors_detail: IDigitalErrorsDetailStatistics;
  digital_errors_distribution: Array<IAttemptsCount>;
  notifications_count: number;
}
