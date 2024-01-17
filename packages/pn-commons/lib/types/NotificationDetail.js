export var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "OK";
    ResponseStatus["PROGRESS"] = "PROGRESS";
    ResponseStatus["PROGRESS_WITH_RETRY"] = "PROGRESS_WITH_RETRY";
    ResponseStatus["KO"] = "KO";
})(ResponseStatus || (ResponseStatus = {}));
var ContactPhase;
(function (ContactPhase) {
    ContactPhase["CHOOSE_DELIVERY"] = "CHOOSE_DELIVERY";
    ContactPhase["SEND_ATTEMPT"] = "SEND_ATTEMPT ";
})(ContactPhase || (ContactPhase = {}));
export var NotificationFeePolicy;
(function (NotificationFeePolicy) {
    NotificationFeePolicy["FLAT_RATE"] = "FLAT_RATE";
    NotificationFeePolicy["DELIVERY_MODE"] = "DELIVERY_MODE";
})(NotificationFeePolicy || (NotificationFeePolicy = {}));
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["REQUIRED"] = "REQUIRED";
    PaymentStatus["SUCCEEDED"] = "SUCCEEDED";
    PaymentStatus["INPROGRESS"] = "IN_PROGRESS";
    PaymentStatus["FAILED"] = "FAILURE";
})(PaymentStatus || (PaymentStatus = {}));
export var PaymentInfoDetail;
(function (PaymentInfoDetail) {
    PaymentInfoDetail["PAYMENT_UNAVAILABLE"] = "PAYMENT_UNAVAILABLE";
    PaymentInfoDetail["PAYMENT_UNKNOWN"] = "PAYMENT_UNKNOWN";
    PaymentInfoDetail["DOMAIN_UNKNOWN"] = "DOMAIN_UNKNOWN";
    PaymentInfoDetail["PAYMENT_ONGOING"] = "PAYMENT_ONGOING";
    PaymentInfoDetail["PAYMENT_EXPIRED"] = "PAYMENT_EXPIRED";
    PaymentInfoDetail["PAYMENT_CANCELED"] = "PAYMENT_CANCELED";
    PaymentInfoDetail["PAYMENT_DUPLICATED"] = "PAYMENT_DUPLICATED";
    PaymentInfoDetail["GENERIC_ERROR"] = "GENERIC_ERROR";
})(PaymentInfoDetail || (PaymentInfoDetail = {}));
export var PaymentAttachmentSName;
(function (PaymentAttachmentSName) {
    PaymentAttachmentSName["PAGOPA"] = "PAGOPA";
    PaymentAttachmentSName["F24"] = "F24";
})(PaymentAttachmentSName || (PaymentAttachmentSName = {}));
export var NotificationDeliveryMode;
(function (NotificationDeliveryMode) {
    NotificationDeliveryMode["ANALOG"] = "analog";
    NotificationDeliveryMode["DIGITAL"] = "digital";
})(NotificationDeliveryMode || (NotificationDeliveryMode = {}));
export var TimelineCategory;
(function (TimelineCategory) {
    TimelineCategory["REQUEST_ACCEPTED"] = "REQUEST_ACCEPTED";
    TimelineCategory["SEND_COURTESY_MESSAGE"] = "SEND_COURTESY_MESSAGE";
    TimelineCategory["GET_ADDRESS"] = "GET_ADDRESS";
    TimelineCategory["PUBLIC_REGISTRY_CALL"] = "PUBLIC_REGISTRY_CALL";
    TimelineCategory["PUBLIC_REGISTRY_RESPONSE"] = "PUBLIC_REGISTRY_RESPONSE";
    TimelineCategory["SCHEDULE_ANALOG_WORKFLOW"] = "SCHEDULE_ANALOG_WORKFLOW";
    TimelineCategory["SCHEDULE_DIGITAL_WORKFLOW"] = "SCHEDULE_DIGITAL_WORKFLOW";
    TimelineCategory["SEND_DIGITAL_DOMICILE"] = "SEND_DIGITAL_DOMICILE";
    TimelineCategory["SEND_DIGITAL_PROGRESS"] = "SEND_DIGITAL_PROGRESS";
    TimelineCategory["SEND_DIGITAL_FEEDBACK"] = "SEND_DIGITAL_FEEDBACK";
    TimelineCategory["REFINEMENT"] = "REFINEMENT";
    TimelineCategory["SCHEDULE_REFINEMENT"] = "SCHEDULE_REFINEMENT";
    TimelineCategory["DIGITAL_SUCCESS_WORKFLOW"] = "DIGITAL_SUCCESS_WORKFLOW";
    TimelineCategory["DIGITAL_FAILURE_WORKFLOW"] = "DIGITAL_FAILURE_WORKFLOW";
    TimelineCategory["ANALOG_SUCCESS_WORKFLOW"] = "ANALOG_SUCCESS_WORKFLOW";
    TimelineCategory["ANALOG_FAILURE_WORKFLOW"] = "ANALOG_FAILURE_WORKFLOW";
    TimelineCategory["SEND_SIMPLE_REGISTERED_LETTER"] = "SEND_SIMPLE_REGISTERED_LETTER";
    TimelineCategory["SEND_SIMPLE_REGISTERED_LETTER_PROGRESS"] = "SEND_SIMPLE_REGISTERED_LETTER_PROGRESS";
    TimelineCategory["NOTIFICATION_VIEWED"] = "NOTIFICATION_VIEWED";
    TimelineCategory["SEND_ANALOG_DOMICILE"] = "SEND_ANALOG_DOMICILE";
    TimelineCategory["PAYMENT"] = "PAYMENT";
    TimelineCategory["COMPLETELY_UNREACHABLE"] = "COMPLETELY_UNREACHABLE";
    TimelineCategory["REQUEST_REFUSED"] = "REQUEST_REFUSED";
    // PN-1647
    TimelineCategory["NOT_HANDLED"] = "NOT_HANDLED";
    TimelineCategory["PREPARE_SIMPLE_REGISTERED_LETTER"] = "PREPARE_SIMPLE_REGISTERED_LETTER";
    TimelineCategory["PREPARE_ANALOG_DOMICILE"] = "PREPARE_ANALOG_DOMICILE";
    TimelineCategory["SEND_ANALOG_PROGRESS"] = "SEND_ANALOG_PROGRESS";
    TimelineCategory["SEND_ANALOG_FEEDBACK"] = "SEND_ANALOG_FEEDBACK";
    TimelineCategory["AAR_GENERATION"] = "AAR_GENERATION";
    TimelineCategory["NOTIFICATION_CANCELLATION_REQUEST"] = "NOTIFICATION_CANCELLATION_REQUEST";
    TimelineCategory["NOTIFICATION_CANCELLED"] = "NOTIFICATION_CANCELLED";
})(TimelineCategory || (TimelineCategory = {}));
export var DigitalDomicileType;
(function (DigitalDomicileType) {
    DigitalDomicileType["PEC"] = "PEC";
    DigitalDomicileType["EMAIL"] = "EMAIL";
    DigitalDomicileType["APPIO"] = "APPIO";
    DigitalDomicileType["SMS"] = "SMS";
})(DigitalDomicileType || (DigitalDomicileType = {}));
export var RecipientType;
(function (RecipientType) {
    RecipientType["PF"] = "PF";
    RecipientType["PG"] = "PG";
})(RecipientType || (RecipientType = {}));
var DeliveryMode;
(function (DeliveryMode) {
    DeliveryMode["DIGITAL"] = "DIGITAL";
    DeliveryMode["ANALOG"] = "ANALOG ";
})(DeliveryMode || (DeliveryMode = {}));
// PN-4484 - only the messages of the SENT_COURTESY kind are meaningful to the user
export var AppIoCourtesyMessageEventType;
(function (AppIoCourtesyMessageEventType) {
    // message effettively sent
    AppIoCourtesyMessageEventType["SENT_COURTESY"] = "SENT_COURTESY";
    // sent a kind of internal message (which don't actually arrive to the user) about "OPTIN"
    AppIoCourtesyMessageEventType["SENT_OPTIN"] = "SENT_OPTIN";
    // another event related to "OPTIN" internal messages
    AppIoCourtesyMessageEventType["NOT_SENT_OPTIN_ALREADY_SENT"] = "NOT_SENT_OPTIN_ALREADY_SENT";
})(AppIoCourtesyMessageEventType || (AppIoCourtesyMessageEventType = {}));
export var AddressSource;
(function (AddressSource) {
    AddressSource["PLATFORM"] = "PLATFORM";
    AddressSource["SPECIAL"] = "SPECIAL";
    AddressSource["GENERAL"] = "GENERAL ";
})(AddressSource || (AddressSource = {}));
export var LegalFactType;
(function (LegalFactType) {
    LegalFactType["AAR"] = "AAR";
    LegalFactType["SENDER_ACK"] = "SENDER_ACK";
    LegalFactType["DIGITAL_DELIVERY"] = "DIGITAL_DELIVERY";
    LegalFactType["ANALOG_DELIVERY"] = "ANALOG_DELIVERY";
    LegalFactType["ANALOG_FAILURE_DELIVERY"] = "ANALOG_FAILURE_DELIVERY";
    LegalFactType["RECIPIENT_ACCESS"] = "RECIPIENT_ACCESS";
    LegalFactType["PEC_RECEIPT"] = "PEC_RECEIPT";
})(LegalFactType || (LegalFactType = {}));
export var PhysicalCommunicationType;
(function (PhysicalCommunicationType) {
    PhysicalCommunicationType["AR_REGISTERED_LETTER"] = "AR_REGISTERED_LETTER";
    PhysicalCommunicationType["REGISTERED_LETTER_890"] = "REGISTERED_LETTER_890";
})(PhysicalCommunicationType || (PhysicalCommunicationType = {}));
