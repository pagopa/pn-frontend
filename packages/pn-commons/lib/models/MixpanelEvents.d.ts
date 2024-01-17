import { NotificationStatus } from './NotificationStatus';
export type EventsType = {
    [key: string]: {
        event_category: string;
        event_type?: EventAction | string;
        getAttributes?: (payload: Record<string, any>) => Record<string, string>;
    };
};
export declare enum EventAction {
    ACTION = "action",
    ERROR = "error",
    SCREEN_VIEW = "screen_view"
}
export declare enum EventCategory {
    UX = "UX",
    TECH = "TECH",
    KO = "KO"
}
export declare enum EventDowntimeType {
    NOT_DISSERVICE = "not_disservice",
    COMPLETED = "completed",
    IN_PROGRESS = "in_progress"
}
export type EventPaymentStatusType = {
    page_number: number;
    count_payment: number;
    count_unpaid: number;
    count_paid: number;
    count_error: number;
    count_expired: number;
    count_canceled: number;
};
export type EventNotificationsListType = {
    banner?: string;
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
export declare enum EventPageType {
    LISTA_NOTIFICHE = "LISTA_NOTIFICHE",
    DETTAGLIO_NOTIFICA = "DETTAGLIO_NOTIFICA",
    LISTA_DELEGHE = "LISTA_DELEGHE",
    STATUS_PAGE = "STATUS_PAGE",
    RECAPITI = "RECAPITI"
}
export type EventCreatedDelegationType = {
    person_type: string;
    mandate_type: string;
};
export declare enum EventPaymentRecipientType {
    SEND_PAYMENT_DETAIL_REFRESH = "SEND_PAYMENT_DETAIL_REFRESH",
    SEND_CANCELLED_NOTIFICATION_REFOUND_INFO = "SEND_CANCELLED_NOTIFICATION_REFOUND_INFO",
    SEND_MULTIPAYMENT_MORE_INFO = "SEND_MULTIPAYMENT_MORE_INFO",
    SEND_DOWNLOAD_PAYMENT_NOTICE = "SEND_DOWNLOAD_PAYMENT_NOTICE",
    SEND_F24_DOWNLOAD = "SEND_F24_DOWNLOAD",
    SEND_F24_DOWNLOAD_SUCCESS = "SEND_F24_DOWNLOAD_SUCCESS",
    SEND_PAYMENT_STATUS = "SEND_PAYMENT_STATUS",
    SEND_F24_DOWNLOAD_TIMEOUT = "SEND_F24_DOWNLOAD_TIMEOUT",
    SEND_PAYMENT_LIST_CHANGE_PAGE = "SEND_PAYMENT_LIST_CHANGE_PAGE",
    SEND_PAYMENT_DETAIL_ERROR = "SEND_PAYMENT_DETAIL_ERROR"
}
