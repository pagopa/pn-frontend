import { ReactNode } from 'react';

import { NotificationStatus } from './NotificationStatus';

/** Notification Detail */
export interface NotificationDetail {
  subject: string;
  abstract?: string;
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NotificationDetailDocument>;
  cancelledIun?: string;
  senderDenomination?: string;
  paymentExpirationDate?: string;
  group?: string;
  iun: string;
  sentAt: string;
  documentsAvailable?: boolean;
  notificationStatus: NotificationStatus;
  notificationStatusHistory: Array<NotificationStatusHistory>;
  timeline: Array<INotificationDetailTimeline>;
  amount?: number;
  otherDocuments?: Array<NotificationDetailDocument>;
  radd?: INotificationDetailTimeline;
}

export type PaymentTpp = {
  paymentButton: string;
  retrievalId: string;
  iun: string;
};

export type PaymentsData = {
  pagoPaF24: Array<PaymentDetails>;
  f24Only: Array<F24PaymentDetails>;
};

export type PagoPAPaymentFullDetails = PagoPAPaymentDetails &
  PaidDetails &
  ExtRegistriesPaymentDetails;

export interface PaymentDetails {
  pagoPa?: PagoPAPaymentFullDetails;
  f24?: F24PaymentDetails;
  isLoading?: boolean; // only fe
}

export type NotificationDetailTimelineDetails =
  | BaseDetails
  | AnalogWorkflowDetails
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
  // To achieve this, we add the LegalFactId object corresponding to such links
  // to the legalFactsIds array for the ANALOG_FAILURE_WORKFLOW timeline elements.
  // ------------------------------------------------
  // Carlos Lombardi, 2023.05.02
  // ------------------------------------------------
  legalFactsIds?: Array<LegalFactId>;
  category: TimelineCategory;
  details: NotificationDetailTimelineDetails;
  hidden?: boolean;
  index?: number;
}

export enum ResponseStatus {
  OK = 'OK',
  KO = 'KO',
}

/* options for documentType
    - Plico: Indica il plico cartaceo
    - AR: Indica la ricevuta di ritorno
    - Indagine: Indica la ricevuta dell'analisi dell'indagine
    - 23L: Indica la ricevuta 23L
 */
interface AnalogFlowAttachment {
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
}

interface BaseDetails {
  recIndex?: number;
  eventTimestamp?: string;
}

export interface AnalogWorkflowDetails extends BaseDetails {
  physicalAddress?: PhysicalAddress;
  generatedAarUrl?: string;
}

export interface SendCourtesyMessageDetails extends BaseDetails {
  digitalAddress: DigitalAddress;
}

export interface SendDigitalDetails extends BaseDetails {
  digitalAddress?: DigitalAddress;
  responseStatus?: ResponseStatus;
  deliveryDetailCode?: string;
}

export interface PaidDetails extends BaseDetails {
  paymentSourceChannel?: string;
  recipientType?: RecipientType;
  amount?: number;
  creditorTaxId: string;
  noticeCode: string;
  uncertainPaymentDate?: boolean;
  notRefinedRecipientIndexes?: Array<number>;
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
  attachmentIdx?: number; // only fe
}

export interface F24PaymentDetails {
  title: string;
  applyCost: boolean;
  recIndex?: number; // only fe
  attachmentIdx?: number; // only fe
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

export enum PaymentAttachmentSName {
  PAGOPA = 'PAGOPA',
  F24 = 'F24',
}

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
  // PN-7743
  PREPARE_ANALOG_DOMICILE_FAILURE = 'PREPARE_ANALOG_DOMICILE_FAILURE',
  SEND_ANALOG_PROGRESS = 'SEND_ANALOG_PROGRESS',
  SEND_ANALOG_FEEDBACK = 'SEND_ANALOG_FEEDBACK',
  AAR_GENERATION = 'AAR_GENERATION',
  NOTIFICATION_CANCELLATION_REQUEST = 'NOTIFICATION_CANCELLATION_REQUEST',
  NOTIFICATION_CANCELLED = 'NOTIFICATION_CANCELLED',
  // PN-9684
  NOTIFICATION_RADD_RETRIEVED = 'NOTIFICATION_RADD_RETRIEVED',
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

export enum DigitalDomicileType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
  APPIO = 'APPIO', // PN-2068
  SMS = 'SMS', // possible type for courtesy message
  SERCQ = 'SERCQ',
  TPP = 'TPP', // Third Party Payment
}

export enum RecipientType {
  PF = 'PF',
  PG = 'PG',
}

export enum LegalFactType {
  SENDER_ACK = 'SENDER_ACK',
  DIGITAL_DELIVERY = 'DIGITAL_DELIVERY',
  ANALOG_DELIVERY = 'ANALOG_DELIVERY',
  ANALOG_FAILURE_DELIVERY = 'ANALOG_FAILURE_DELIVERY',
  RECIPIENT_ACCESS = 'RECIPIENT_ACCESS',
  PEC_RECEIPT = 'PEC_RECEIPT', // PN-2107
  NOTIFICATION_CANCELLED = 'NOTIFICATION_CANCELLED',
}

export interface LegalFactId {
  key: string;
  category: LegalFactType | 'AAR';
}

export interface NotificationDetailOtherDocument extends NotificationDetailDocument {
  recipient?: {
    denomination: string;
    taxId: string;
  };
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

export type DigitalDetails = SendCourtesyMessageDetails | SendDigitalDetails;

export type AnalogDetails = SendPaperDetails | AnalogWorkflowDetails;

/* External Registries  */
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

export enum PaymentStatus {
  REQUIRED = 'REQUIRED',
  SUCCEEDED = 'SUCCEEDED',
  INPROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILURE',
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
}

/** Api models  */
export enum NotificationDocumentType {
  AAR = 'AAR',
  ATTACHMENT = 'ATTACHMENT',
  LEGAL_FACT = 'LEGAL_FACT',
}

export interface NotificationDocumentRequest {
  iun: string;
  documentType: NotificationDocumentType;
  documentIdx?: number;
  documentId?: string;
  mandateId?: string;
}

export interface NotificationDocumentResponse {
  filename: string;
  contentLength: number;
  url: string;
  retryAfter?: number;
}

export enum PhysicalAddressLookup {
  MANUAL = 'MANUAL',
  NATIONAL_REGISTRY = 'NATIONAL_REGISTRY',
}