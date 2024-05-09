import { NotificationStatus } from '@pagopa-pn/pn-commons';

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

interface NotificationOverview {
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

interface DigitalNotificationFocus {
  notification_send_date: string;
  error_type: string;
  failed_attempts_count: string | number;
  notifications_count: string | number;
}

export interface StatisticsResponse {
  sender_id: string;
  last_update_timestamp: string;
  start_date: string;
  end_date: string;
  notifications_overview: Array<NotificationOverview>;
  digital_notification_focus: Array<DigitalNotificationFocus>;
}

export interface StatisticsParams<TDate extends string | Date> {
  cxType: string;
  cxId: string;
  startDate: TDate;
  endDate: TDate;
}
