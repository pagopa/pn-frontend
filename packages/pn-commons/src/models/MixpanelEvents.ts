import { NotificationStatus } from './NotificationStatus';

export type EventsType = {
  [key: string]: {
    // property category should be of type EventCategory however we should finish all the new implementations in PA and PG first.
    // So when PA and PG events are done, set type of category to EventCategory
    // Nicola Giornetta - 21-11-2023
    category: string;
    action: string;
    getAttributes?: (payload: Record<string, any>) => Record<string, string>;
  };
};

export enum EventCategory {
  UX = 'UX',
  TECH = 'TECH',
  KO = 'KO',
}

export enum EventDowntimeType {
  NOT_DISSERVICE = 'not_disservice',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
}

export type EventPaymentStatusType = {
  page_number: number;
  count_payment: number;
  count_unpaid: number;
  count_paid: number;
  count_error: number;
  count_expired: number;
  count_canceled: number;
  count_revoked: number;
};

export type EventNotificationsListType = {
  delegate: boolean;
  page_number: number;
  total_count: number;
  unread_count: number;
  delivered_count: number;
  opened_count: number;
  expired_count: number;
  not_found_count: number;
  cancelled_count: number;
};

export type EventNotificationDetailType = {
  notification_owner: boolean;
  notification_status: NotificationStatus;
  contains_payment: boolean;
  disservice_status: EventDowntimeType;
  contains_multipayment: 'yes' | 'no';
  count_payment: number;
  contains_f24: 'yes' | 'no';
};

export type EventMandateNotificationsListType = {
  total_mandates_given_count: number;
  pending_mandates_given_count: number;
  active_mandates_given_count: number;
  total_mandates_received_count: number;
  pending_mandates_received_count: number;
  active_mandates_received_count: number;
};

export enum EventPageType {
  LISTA_NOTIFICHE = 'LISTA_NOTIFICHE',
  DETTAGLIO_NOTIFICA = 'DETTAGLIO_NOTIFICA',
  LISTA_DELEGHE = 'LISTA_DELEGHE',
  STATUS_PAGE = 'STATUS_PAGE',
  RECAPITI = 'RECAPITI',
}

export type EventCreatedDelegationType = {
  person_type: string;
  mandate_type: string;
};
