import { ReactNode } from 'react';
import { NotificationStatus } from './NotificationStatus';

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
  // only fe
  otherDocuments?: Array<NotificationDetailDocument>;
  paymentHistory?: Array<PaymentHistory>;
}

export type PaymentHistory = PaidDetails & {
  recipientDenomination: string;
  recipientTaxId: string;
};

export type NotificationDetailTimelineDetails =
  | BaseDetails
  | AarDetails
  | ViewedDetails
  | AnalogWorkflowDetails
  | DigitalWorkflowDetails
  | AddressInfoDetails
  | PublicRegistryCallDetails
  | PublicRegistryResponseDetails
  | RequestRefusedDetails
  | ScheduleDigitalWorkflowDetails
  | SendCourtesyMessageDetails
  | SendDigitalDetails
  | SendPaperDetails
  | PaidDetails
  // PN-1647
  | NotHandledDetails;

export interface INotificationDetailTimeline {
  elementId: string;
  timestamp: string;
  // ------------------------------------------------
  // PN-5484
  // ------------------------------------------------
  // The link to the AAR (i.e. details.generatedAarUrl) included to ANALOG_FAILURE_WORKFLOW timeline elements
  // must be handled analogously to legal facts, 
  // i.e. a link must be shown inside the graphic timeline.
  // To achieve this, we add the NotificationDetailOtherDocument object corresponding to such links
  // to the legalFactsIds array for the ANALOG_FAILURE_WORKFLOW timeline elements.
  // Consequently, each element of legalFactsIds can be either 
  // - a LegalFactId object coming from legalFactsIds in the API response, or 
  // - a NotificationDetailOtherDocument coming from details.generatedAarUrl in ANALOG_FAILURE_WORKFLOW timeline elements
  // ------------------------------------------------
  // Carlos Lombardi, 2023.05.02
  // ------------------------------------------------
  legalFactsIds?: Array<LegalFactId | NotificationDetailOtherDocument>;
  category: TimelineCategory;
  details: NotificationDetailTimelineDetails;
  // only fe
  hidden?: boolean;
  index?: number;
}

export enum ResponseStatus {
  OK = 'OK',
  PROGRESS = 'PROGRESS',
  PROGRESS_WITH_RETRY = 'PROGRESS_WITH_RETRY',
  KO = 'KO',
}

/* options for documentType
    - Plico: Indica il plico cartaceo
    - AR: Indica la ricevuta di ritorno
    - Indagine: Indica la ricevuta dell'analisi dell'indagine
    - 23L: Indica la ricevuta 23L
 */
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

enum ContactPhase {
  CHOOSE_DELIVERY = 'CHOOSE_DELIVERY',
  SEND_ATTEMPT = 'SEND_ATTEMPT ',
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
  // ---------------------------------------------------
  // the following fields are present in some digital-flow-related events,
  // but they currently have no influence in the behavior of PN frontend.
  // I keep them just because they are included in several test notification structures
  // ---------------------------------------------------
  // Carlos Lombardi, 2023.04.18
  // ---------------------------------------------------
  digitalAddressSource?: AddressSource;
  retryNumber?: number;
  notificationDate?: string;
}

export interface PaidDetails extends BaseDetails {
  paymentSourceChannel: string;
  recipientType: RecipientType;
  amount?: number;
  creditorTaxId?: string;
  idF24?: string;
  noticeCode?: string;
  paymentObject?: string;
}

// PN-1647
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
  payment?: NotificationDetailPayment;
}

export interface NotificationDetailDocument {
  digests: {
    sha256: string;
  };
  contentType: string;
  ref: {
    key: string;
    versionToken: string;
  };
  title?: string;
  requiresAck?: boolean;
  docIdx?: string;
  documentId?: string;
  documentType?: string;
  recIndex?: number;
}

export enum NotificationFeePolicy {
  FLAT_RATE = 'FLAT_RATE',
  DELIVERY_MODE = 'DELIVERY_MODE',
}

export interface NotificationDetailPayment {
  noticeCode?: string;
  noticeCodeAlternative?: string;
  creditorTaxId: string;
  pagoPaForm?: NotificationDetailDocument;
  f24flatRate?: NotificationDetailDocument;
  f24standard?: NotificationDetailDocument;
}

export enum PaymentStatus {
  REQUIRED = 'REQUIRED',
  SUCCEEDED = 'SUCCEEDED',
  INPROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILURE',
}

export enum PaymentInfoDetail {
  PAYMENT_UNAVAILABLE = 'PAYMENT_UNAVAILABLE', // Technical Error
  PAYMENT_UNKNOWN = 'PAYMENT_UNKNOWN', // Payment data error
  DOMAIN_UNKNOWN = 'DOMAIN_UNKNOWN', // Creditor institution error
  PAYMENT_ONGOING = 'PAYMENT_ONGOING', // Payment on going
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED', // Payment expired
  PAYMENT_CANCELED = 'PAYMENT_CANCELED', // Payment canceled
  PAYMENT_DUPLICATED = 'PAYMENT_DUPLICATED', // Payment duplicated
  GENERIC_ERROR = 'GENERIC_ERROR', // Generic error
}

export interface PaymentInfo {
  status: PaymentStatus;
  detail?: PaymentInfoDetail;
  detail_v2?: string;
  errorCode?: string;
  amount?: number;
  url: string;
}

export interface PaymentNotice {
  noticeNumber: string;
  fiscalCode: string;
  amount: number;
  companyName: string;
  description: string;
}

export enum PaymentAttachmentSName {
  PAGOPA = 'PAGOPA',
  F24 = 'F24',
}

export type PaymentAttachmentNameType = number | PaymentAttachmentSName;

export enum NotificationDeliveryMode {
  ANALOG = 'analog',
  DIGITAL = 'digital',
}
export interface NotificationStatusHistory {
  status: NotificationStatus;
  activeFrom: string;
  relatedTimelineElements: Array<string>;
  // only fe
  steps?: Array<INotificationDetailTimeline>;
  recipient?: string;
  // this is useful for the DELIVERED status only
  deliveryMode?: NotificationDeliveryMode;
}

export enum TimelineCategory {
  REQUEST_ACCEPTED = 'REQUEST_ACCEPTED',
  SEND_COURTESY_MESSAGE = 'SEND_COURTESY_MESSAGE',
  GET_ADDRESS = 'GET_ADDRESS',
  PUBLIC_REGISTRY_CALL = 'PUBLIC_REGISTRY_CALL',
  PUBLIC_REGISTRY_RESPONSE = 'PUBLIC_REGISTRY_RESPONSE',
  SCHEDULE_ANALOG_WORKFLOW = 'SCHEDULE_ANALOG_WORKFLOW',
  SCHEDULE_DIGITAL_WORKFLOW = 'SCHEDULE_DIGITAL_WORKFLOW',
  SEND_DIGITAL_DOMICILE = 'SEND_DIGITAL_DOMICILE',
  SEND_DIGITAL_PROGRESS = 'SEND_DIGITAL_PROGRESS',
  SEND_DIGITAL_FEEDBACK = 'SEND_DIGITAL_FEEDBACK',
  REFINEMENT = 'REFINEMENT',
  SCHEDULE_REFINEMENT = 'SCHEDULE_REFINEMENT',
  DIGITAL_SUCCESS_WORKFLOW = 'DIGITAL_SUCCESS_WORKFLOW',
  DIGITAL_FAILURE_WORKFLOW = 'DIGITAL_FAILURE_WORKFLOW',
  ANALOG_SUCCESS_WORKFLOW = 'ANALOG_SUCCESS_WORKFLOW',
  ANALOG_FAILURE_WORKFLOW = 'ANALOG_FAILURE_WORKFLOW',
  SEND_SIMPLE_REGISTERED_LETTER = 'SEND_SIMPLE_REGISTERED_LETTER',
  SEND_SIMPLE_REGISTERED_LETTER_PROGRESS = 'SEND_SIMPLE_REGISTERED_LETTER_PROGRESS',
  NOTIFICATION_VIEWED = 'NOTIFICATION_VIEWED',
  SEND_ANALOG_DOMICILE = 'SEND_ANALOG_DOMICILE',
  PAYMENT = 'PAYMENT',
  COMPLETELY_UNREACHABLE = 'COMPLETELY_UNREACHABLE',
  REQUEST_REFUSED = 'REQUEST_REFUSED',
  // PN-1647
  NOT_HANDLED = 'NOT_HANDLED',
  PREPARE_SIMPLE_REGISTERED_LETTER = 'PREPARE_SIMPLE_REGISTERED_LETTER',
  PREPARE_ANALOG_DOMICILE = 'PREPARE_ANALOG_DOMICILE',
  SEND_ANALOG_PROGRESS = 'SEND_ANALOG_PROGRESS',
  SEND_ANALOG_FEEDBACK = 'SEND_ANALOG_FEEDBACK',
  AAR_GENERATION = 'AAR_GENERATION',
}

interface DigitalAddress {
  type: DigitalDomicileType;
  address: string;
}

interface PhysicalAddress {
  at?: string;
  address: string;
  addressDetails?: string;
  zip: string;
  municipality: string;
  municipalityDetails?: string;
  province?: string;
  foreignState?: string;
}

export enum DigitalDomicileType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
  APPIO = 'APPIO', // PN-2068
  SMS = 'SMS', // possible type for courtesy message
}

export enum RecipientType {
  PF = 'PF',
  PG = 'PG',
}

enum DeliveryMode {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG ',
}

// PN-4484 - only the messages of the SENT_COURTESY kind are meaningful to the user
export enum AppIoCourtesyMessageEventType {
  // message effettively sent
  SENT_COURTESY = 'SENT_COURTESY',    
  // sent a kind of internal message (which don't actually arrive to the user) about "OPTIN" 
  SENT_OPTIN = 'SENT_OPTIN',
  // another event related to "OPTIN" internal messages
  NOT_SENT_OPTIN_ALREADY_SENT = 'NOT_SENT_OPTIN_ALREADY_SENT',
}

export enum AddressSource {
  PLATFORM = 'PLATFORM',
  SPECIAL = 'SPECIAL',
  GENERAL = 'GENERAL ',
}

export enum LegalFactType {
  AAR = 'AAR',
  SENDER_ACK = 'SENDER_ACK',
  DIGITAL_DELIVERY = 'DIGITAL_DELIVERY',
  ANALOG_DELIVERY = 'ANALOG_DELIVERY',
  ANALOG_FAILURE_DELIVERY = 'ANALOG_FAILURE_DELIVERY',  
  RECIPIENT_ACCESS = 'RECIPIENT_ACCESS',
  PEC_RECEIPT = 'PEC_RECEIPT', // PN-2107
}

export interface LegalFactId {
  key: string;
  category: LegalFactType;
}

export interface NotificationDetailOtherDocument {
  documentId: string;
  documentType: string;
}

export enum PhysicalCommunicationType {
  AR_REGISTERED_LETTER = 'AR_REGISTERED_LETTER',
  REGISTERED_LETTER_890 = 'REGISTERED_LETTER_890',
}

export interface NotificationDetailTableRow {
  id: number;
  label: string;
  value: ReactNode;
}

export type DigitalDetails =
  | DigitalWorkflowDetails
  | PublicRegistryResponseDetails
  | ScheduleDigitalWorkflowDetails
  | SendCourtesyMessageDetails
  | SendDigitalDetails;

export type AnalogDetails =
  | SendPaperDetails
  | AnalogWorkflowDetails
  | PublicRegistryResponseDetails;
