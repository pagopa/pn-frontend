import { ReactNode } from 'react';
import { NotificationStatus } from './NotificationStatus';
/** Notification Detail */
export interface NotificationDetail {
    idempotenceToken?: string;
    paProtocolNumber: string;
    subject: string;
    abstract?: string;
    recipients: Array<NotificationDetailRecipient>;
    documents: Array<NotificationDetailDocument>;
    notificationFeePolicy: NotificationFeePolicy;
    cancelledIun?: string;
    physicalCommunicationType: PhysicalCommunicationType;
    senderDenomination?: string;
    paymentExpirationDate?: string;
    senderTaxId?: string;
    group?: string;
    senderPaId: string;
    iun: string;
    sentAt: string;
    cancelledByIun?: string;
    documentsAvailable?: boolean;
    notificationStatus: NotificationStatus;
    notificationStatusHistory: Array<NotificationStatusHistory>;
    timeline: Array<INotificationDetailTimeline>;
    amount?: number;
    otherDocuments?: Array<NotificationDetailDocument>;
}
export type PaymentsData = {
    pagoPaF24: Array<PaymentDetails>;
    f24Only: Array<F24PaymentDetails>;
};
export type PagoPAPaymentFullDetails = PagoPAPaymentDetails & PaidDetails & ExtRegistriesPaymentDetails;
export interface PaymentDetails {
    pagoPa?: PagoPAPaymentFullDetails;
    f24?: F24PaymentDetails;
    isLoading?: boolean;
}
export type NotificationDetailTimelineDetails = BaseDetails | AarDetails | ViewedDetails | AnalogWorkflowDetails | DigitalWorkflowDetails | AddressInfoDetails | PublicRegistryCallDetails | PublicRegistryResponseDetails | RequestRefusedDetails | ScheduleDigitalWorkflowDetails | SendCourtesyMessageDetails | SendDigitalDetails | SendPaperDetails | PaidDetails | NotHandledDetails;
export interface INotificationDetailTimeline {
    elementId: string;
    timestamp: string;
    legalFactsIds?: Array<LegalFactId | NotificationDetailOtherDocument>;
    category: TimelineCategory;
    details: NotificationDetailTimelineDetails;
    hidden?: boolean;
    index?: number;
}
export declare enum ResponseStatus {
    OK = "OK",
    PROGRESS = "PROGRESS",
    PROGRESS_WITH_RETRY = "PROGRESS_WITH_RETRY",
    KO = "KO"
}
export interface AnalogFlowAttachment {
    id: string;
    documentType: string;
    url: string;
}
export interface SendPaperDetails extends AnalogWorkflowDetails {
    serviceLevel?: PhysicalCommunicationType;
    productType?: string;
    registeredLetterCode?: string;
    responseStatus?: ResponseStatus;
    deliveryFailureCause?: string;
    deliveryDetailCode?: string;
    sendRequestId?: string;
    attachments?: Array<AnalogFlowAttachment>;
}
export interface PrepareAnalogDomicileFailureDetails extends BaseDetails {
    foundAddress?: PhysicalAddress;
    failureCause?: string;
    prepareRequestId?: string;
}
interface BaseDetails {
    recIndex?: number;
}
interface DelegateInfo {
    internalId: string;
    taxId: string;
    operatorUuid: string;
    mandateId: string;
    denomination: string;
    delegateType: RecipientType;
}
export interface ViewedDetails extends BaseDetails {
    delegateInfo?: DelegateInfo;
}
export interface AarDetails {
    recIndex?: number;
    errors?: Array<string>;
    generatedAarUrl?: string;
    numberOfPages?: number;
}
export interface AnalogWorkflowDetails extends BaseDetails {
    physicalAddress?: PhysicalAddress;
}
export interface DigitalWorkflowDetails extends BaseDetails {
    digitalAddress?: DigitalAddress;
}
interface AddressInfoDetails extends BaseDetails {
    digitalAddressSource: AddressSource;
    isAvailable: boolean;
    attemptDate: string;
}
declare enum ContactPhase {
    CHOOSE_DELIVERY = "CHOOSE_DELIVERY",
    SEND_ATTEMPT = "SEND_ATTEMPT "
}
interface PublicRegistryCallDetails extends BaseDetails {
    deliveryMode: DeliveryMode;
    contactPhase: ContactPhase;
    sentAttemptMade: number;
    sendDate: string;
}
interface PublicRegistryResponseDetails extends BaseDetails {
    digitalAddress: DigitalAddress;
    physicalAddress: PhysicalAddress;
}
interface RequestRefusedDetails extends BaseDetails {
    errors: Array<string>;
}
interface ScheduleDigitalWorkflowDetails extends BaseDetails, DigitalAddress {
    digitalAddress: DigitalAddress;
    digitalAddressSource: AddressSource;
    sentAttemptMade: number;
    lastAttemptDate: string;
}
export interface SendCourtesyMessageDetails extends BaseDetails {
    digitalAddress: DigitalAddress;
    sendDate: string;
    ioSendMessageResult?: AppIoCourtesyMessageEventType;
}
export interface SendDigitalDetails extends BaseDetails {
    digitalAddress?: DigitalAddress;
    responseStatus?: 'OK' | 'KO';
    deliveryDetailCode?: string;
    digitalAddressSource?: AddressSource;
    retryNumber?: number;
    notificationDate?: string;
}
export interface PaidDetails extends BaseDetails {
    paymentSourceChannel?: string;
    recipientType: RecipientType;
    amount?: number;
    creditorTaxId: string;
    noticeCode: string;
}
export interface NotHandledDetails extends BaseDetails {
    reasonCode: string;
    reason: string;
}
export interface NotificationDetailRecipient {
    recipientType: RecipientType;
    taxId: string;
    denomination: string;
    digitalDomicile?: DigitalAddress;
    physicalAddress?: PhysicalAddress;
    payments?: Array<NotificationDetailPayment>;
}
export interface Attachment {
    digests: {
        sha256: string;
    };
    contentType: string;
    ref: {
        key: string;
        versionToken: string;
    };
}
export interface NotificationDetailDocument extends Attachment {
    title?: string;
    requiresAck?: boolean;
    docIdx?: string;
    documentId?: string;
    documentType?: string;
    recIndex?: number;
}
export declare enum NotificationFeePolicy {
    FLAT_RATE = "FLAT_RATE",
    DELIVERY_MODE = "DELIVERY_MODE"
}
export interface PaymentAttachment {
    filename: string;
    contenType: string;
    contentLength: number;
    sha256: string;
    url?: string;
    retryAfter?: number;
}
export interface PagoPAPaymentDetails {
    creditorTaxId: string;
    noticeCode: string;
    attachment?: NotificationDetailDocument;
    applyCost: boolean;
    attachmentIdx?: number;
}
export interface F24PaymentDetails {
    title: string;
    applyCost: boolean;
    recIndex?: number;
    attachmentIdx?: number;
    metadataAttachment: Attachment;
}
export interface NotificationDetailPayment {
    pagoPa?: PagoPAPaymentDetails;
    f24?: F24PaymentDetails;
}
export interface PaymentNotice {
    noticeNumber: string;
    fiscalCode: string;
    amount: number;
    companyName: string;
    description: string;
}
export declare enum PaymentAttachmentSName {
    PAGOPA = "PAGOPA",
    F24 = "F24"
}
export type PaymentAttachmentNameType = number | PaymentAttachmentSName;
export declare enum NotificationDeliveryMode {
    ANALOG = "analog",
    DIGITAL = "digital"
}
export interface NotificationStatusHistory {
    status: NotificationStatus;
    activeFrom: string;
    relatedTimelineElements: Array<string>;
    steps?: Array<INotificationDetailTimeline>;
    recipient?: string;
    deliveryMode?: NotificationDeliveryMode;
}
export declare enum TimelineCategory {
    REQUEST_ACCEPTED = "REQUEST_ACCEPTED",
    SEND_COURTESY_MESSAGE = "SEND_COURTESY_MESSAGE",
    GET_ADDRESS = "GET_ADDRESS",
    PUBLIC_REGISTRY_CALL = "PUBLIC_REGISTRY_CALL",
    PUBLIC_REGISTRY_RESPONSE = "PUBLIC_REGISTRY_RESPONSE",
    SCHEDULE_ANALOG_WORKFLOW = "SCHEDULE_ANALOG_WORKFLOW",
    SCHEDULE_DIGITAL_WORKFLOW = "SCHEDULE_DIGITAL_WORKFLOW",
    SEND_DIGITAL_DOMICILE = "SEND_DIGITAL_DOMICILE",
    SEND_DIGITAL_PROGRESS = "SEND_DIGITAL_PROGRESS",
    SEND_DIGITAL_FEEDBACK = "SEND_DIGITAL_FEEDBACK",
    REFINEMENT = "REFINEMENT",
    SCHEDULE_REFINEMENT = "SCHEDULE_REFINEMENT",
    DIGITAL_SUCCESS_WORKFLOW = "DIGITAL_SUCCESS_WORKFLOW",
    DIGITAL_FAILURE_WORKFLOW = "DIGITAL_FAILURE_WORKFLOW",
    ANALOG_SUCCESS_WORKFLOW = "ANALOG_SUCCESS_WORKFLOW",
    ANALOG_FAILURE_WORKFLOW = "ANALOG_FAILURE_WORKFLOW",
    SEND_SIMPLE_REGISTERED_LETTER = "SEND_SIMPLE_REGISTERED_LETTER",
    SEND_SIMPLE_REGISTERED_LETTER_PROGRESS = "SEND_SIMPLE_REGISTERED_LETTER_PROGRESS",
    NOTIFICATION_VIEWED = "NOTIFICATION_VIEWED",
    SEND_ANALOG_DOMICILE = "SEND_ANALOG_DOMICILE",
    PAYMENT = "PAYMENT",
    COMPLETELY_UNREACHABLE = "COMPLETELY_UNREACHABLE",
    REQUEST_REFUSED = "REQUEST_REFUSED",
    NOT_HANDLED = "NOT_HANDLED",
    PREPARE_SIMPLE_REGISTERED_LETTER = "PREPARE_SIMPLE_REGISTERED_LETTER",
    PREPARE_ANALOG_DOMICILE = "PREPARE_ANALOG_DOMICILE",
    PREPARE_ANALOG_DOMICILE_FAILURE = "PREPARE_ANALOG_DOMICILE_FAILURE",
    SEND_ANALOG_PROGRESS = "SEND_ANALOG_PROGRESS",
    SEND_ANALOG_FEEDBACK = "SEND_ANALOG_FEEDBACK",
    AAR_GENERATION = "AAR_GENERATION",
    NOTIFICATION_CANCELLATION_REQUEST = "NOTIFICATION_CANCELLATION_REQUEST",
    NOTIFICATION_CANCELLED = "NOTIFICATION_CANCELLED"
}
interface DigitalAddress {
    type: DigitalDomicileType;
    address: string;
}
export interface PhysicalAddress {
    at?: string;
    address: string;
    addressDetails?: string;
    zip: string;
    municipality: string;
    municipalityDetails?: string;
    province?: string;
    foreignState?: string;
}
export declare enum DigitalDomicileType {
    PEC = "PEC",
    EMAIL = "EMAIL",
    APPIO = "APPIO",
    SMS = "SMS"
}
export declare enum RecipientType {
    PF = "PF",
    PG = "PG"
}
declare enum DeliveryMode {
    DIGITAL = "DIGITAL",
    ANALOG = "ANALOG "
}
export declare enum AppIoCourtesyMessageEventType {
    SENT_COURTESY = "SENT_COURTESY",
    SENT_OPTIN = "SENT_OPTIN",
    NOT_SENT_OPTIN_ALREADY_SENT = "NOT_SENT_OPTIN_ALREADY_SENT"
}
export declare enum AddressSource {
    PLATFORM = "PLATFORM",
    SPECIAL = "SPECIAL",
    GENERAL = "GENERAL "
}
export declare enum LegalFactType {
    AAR = "AAR",
    SENDER_ACK = "SENDER_ACK",
    DIGITAL_DELIVERY = "DIGITAL_DELIVERY",
    ANALOG_DELIVERY = "ANALOG_DELIVERY",
    ANALOG_FAILURE_DELIVERY = "ANALOG_FAILURE_DELIVERY",
    RECIPIENT_ACCESS = "RECIPIENT_ACCESS",
    PEC_RECEIPT = "PEC_RECEIPT"
}
export interface LegalFactId {
    key: string;
    category: LegalFactType;
}
export interface NotificationDetailOtherDocument {
    documentId: string;
    documentType: string;
}
export declare enum PhysicalCommunicationType {
    AR_REGISTERED_LETTER = "AR_REGISTERED_LETTER",
    REGISTERED_LETTER_890 = "REGISTERED_LETTER_890"
}
export interface NotificationDetailTableRow {
    id: number;
    label: string;
    value: ReactNode;
}
export type DigitalDetails = DigitalWorkflowDetails | PublicRegistryResponseDetails | ScheduleDigitalWorkflowDetails | SendCourtesyMessageDetails | SendDigitalDetails;
export type AnalogDetails = SendPaperDetails | AnalogWorkflowDetails | PublicRegistryResponseDetails;
/** External Registries  */
export declare enum PaymentInfoDetail {
    PAYMENT_UNAVAILABLE = "PAYMENT_UNAVAILABLE",
    PAYMENT_UNKNOWN = "PAYMENT_UNKNOWN",
    DOMAIN_UNKNOWN = "DOMAIN_UNKNOWN",
    PAYMENT_ONGOING = "PAYMENT_ONGOING",
    PAYMENT_EXPIRED = "PAYMENT_EXPIRED",
    PAYMENT_CANCELED = "PAYMENT_CANCELED",
    PAYMENT_DUPLICATED = "PAYMENT_DUPLICATED",
    GENERIC_ERROR = "GENERIC_ERROR"
}
export declare enum PaymentStatus {
    REQUIRED = "REQUIRED",
    SUCCEEDED = "SUCCEEDED",
    INPROGRESS = "IN_PROGRESS",
    FAILED = "FAILURE"
}
export interface ExtRegistriesPaymentDetails {
    creditorTaxId: string;
    noticeCode: string;
    status: PaymentStatus;
    amount?: number;
    causaleVersamento?: string;
    dueDate?: string;
    detail?: PaymentInfoDetail;
    detail_v2?: string;
    errorCode?: string;
    url?: string;
}
export {};
