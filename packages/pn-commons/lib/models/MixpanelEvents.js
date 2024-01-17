export var EventAction;
(function (EventAction) {
    EventAction["ACTION"] = "action";
    EventAction["ERROR"] = "error";
    EventAction["SCREEN_VIEW"] = "screen_view";
})(EventAction || (EventAction = {}));
export var EventCategory;
(function (EventCategory) {
    EventCategory["UX"] = "UX";
    EventCategory["TECH"] = "TECH";
    EventCategory["KO"] = "KO";
})(EventCategory || (EventCategory = {}));
export var EventDowntimeType;
(function (EventDowntimeType) {
    EventDowntimeType["NOT_DISSERVICE"] = "not_disservice";
    EventDowntimeType["COMPLETED"] = "completed";
    EventDowntimeType["IN_PROGRESS"] = "in_progress";
})(EventDowntimeType || (EventDowntimeType = {}));
export var EventPageType;
(function (EventPageType) {
    EventPageType["LISTA_NOTIFICHE"] = "LISTA_NOTIFICHE";
    EventPageType["DETTAGLIO_NOTIFICA"] = "DETTAGLIO_NOTIFICA";
    EventPageType["LISTA_DELEGHE"] = "LISTA_DELEGHE";
    EventPageType["STATUS_PAGE"] = "STATUS_PAGE";
    EventPageType["RECAPITI"] = "RECAPITI";
})(EventPageType || (EventPageType = {}));
export var EventPaymentRecipientType;
(function (EventPaymentRecipientType) {
    EventPaymentRecipientType["SEND_PAYMENT_DETAIL_REFRESH"] = "SEND_PAYMENT_DETAIL_REFRESH";
    EventPaymentRecipientType["SEND_CANCELLED_NOTIFICATION_REFOUND_INFO"] = "SEND_CANCELLED_NOTIFICATION_REFOUND_INFO";
    EventPaymentRecipientType["SEND_MULTIPAYMENT_MORE_INFO"] = "SEND_MULTIPAYMENT_MORE_INFO";
    EventPaymentRecipientType["SEND_DOWNLOAD_PAYMENT_NOTICE"] = "SEND_DOWNLOAD_PAYMENT_NOTICE";
    EventPaymentRecipientType["SEND_F24_DOWNLOAD"] = "SEND_F24_DOWNLOAD";
    EventPaymentRecipientType["SEND_F24_DOWNLOAD_SUCCESS"] = "SEND_F24_DOWNLOAD_SUCCESS";
    EventPaymentRecipientType["SEND_PAYMENT_STATUS"] = "SEND_PAYMENT_STATUS";
    EventPaymentRecipientType["SEND_F24_DOWNLOAD_TIMEOUT"] = "SEND_F24_DOWNLOAD_TIMEOUT";
    EventPaymentRecipientType["SEND_PAYMENT_LIST_CHANGE_PAGE"] = "SEND_PAYMENT_LIST_CHANGE_PAGE";
    EventPaymentRecipientType["SEND_PAYMENT_DETAIL_ERROR"] = "SEND_PAYMENT_DETAIL_ERROR";
})(EventPaymentRecipientType || (EventPaymentRecipientType = {}));
