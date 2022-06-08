import { ReactNode } from 'react';
import { NotificationStatus } from './NotificationStatus';

// =========== START TEMP: WAITING FOR PAYMENT APIs DEFINITION ===========

export enum PaymentStatus {
  REQUIRED = "REQUIRED",
  SUCCEEDED = "SUCCEEDED",
  INPROGRESS = "IN_PROGRESS",
  FAILED = "FAILED"
}

export enum PaymentInfoDetail {
  PAYMENT_UNAVAILABLE = "PAYMENT_UNAVAILABLE",    // Technical Error              *
  PAYMENT_UNKNOWN = "PAYMENT_UNKNOWN",            // Payment data error           *
  DOMAIN_UNKNOWN = "DOMAIN_UNKNOWN",              // Creditor institution error   *
  PAYMENT_ONGOING = "PAYMENT_ONGOING",            // Payment on going             
  PAYMENT_EXPIRED = "PAYMENT_EXPIRED",            // Payment expired              *
  PAYMENT_CANCELED = "PAYMENT_CANCELED",          // Payment cancelled            *
  PAYMENT_DUPLICATED = "PAYMENT_DUPLICATED",      // Payment duplicated           
  GENERIC_ERROR = "GENERIC_ERROR"                 // Generic error                *
}

export interface PaymentInfo {
  status: PaymentStatus;
  detail?: PaymentInfoDetail;
  detail_v2?: string;
  errorCode?: string;
  amount?: number;
}

export enum PaymentAttachmentSName {
  PAGOPA = "PAGOPA",
  F24 = "F24"
}

export type PaymentAttachmentNameType = number | PaymentAttachmentSName;

// =========== END TEMP: WAITING FOR PAYMENT APIs DEFINITION ===========

export interface NotificationDetail {
  iun: string;
  paNotificationId: string;
  subject: string;
  sentAt: string;
  cancelledIun: string;
  cancelledByIun: string;
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NotificationDetailDocument>;
  documentsAvailable: boolean;
  notificationStatus: NotificationStatus;
  notificationStatusHistory: Array<NotificationStatusHistory>;
  timeline: Array<INotificationDetailTimeline>;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
}

export interface INotificationDetailTimeline {
  elementId: string;
  timestamp: string;
  category: TimelineCategory;
  details:
    | BaseDetails
    | AnalogWorkflowDetails
    | AddressInfoDetails
    | NotificationPathChooseDetails
    | PublicRegistryCallDetails
    | PublicRegistryResponseDetails
    | RecivedDetails
    | RequestRefusedDetails
    | ScheduleWorkflowDetails
    | SendCourtesyMessageDetails
    | SendDigitalDetails
    | SendPaperDetails;
  legalFactsIds?: Array<LegalFactId>;
  // only fe
  hidden?: boolean;
}

export interface SendPaperDetails {
  category: TimelineCategory;
  taxId: string;
  address: PhysicalAddress;
  serviceLevel: PhysicalCommunicationType;
  sentAttemptMade: number;
  investigation: boolean;
  newAddress?: PhysicalAddress;
  errors?: Array<string>;
}

interface BaseDetails {
  category: TimelineCategory;
  taxId: string;
}

export interface AnalogWorkflowDetails {
  category: TimelineCategory;
  taxId: string;
  address?: PhysicalAddress;
}

interface AddressInfoDetails {
  category: TimelineCategory;
  taxId: string;
  source: AddressSource;
  isAvailable: boolean;
  attemptDate: string;
  available: boolean;
}

export interface NotificationPathChooseDetails {
  category: TimelineCategory;
  taxId: string;
  deliveryMode: DeliveryMode;
  physicalAddress: PhysicalAddress;
  platform: DigitalAddress;
  special: DigitalAddress;
  general: DigitalAddress;
  courtesyAddresses: Array<DigitalAddress>;
}

enum ContactPhase {
  CHOOSE_DELIVERY = 'CHOOSE_DELIVERY',
  SEND_ATTEMPT = 'SEND_ATTEMPT ',
}

interface PublicRegistryCallDetails {
  category: TimelineCategory;
  taxId: string;
  deliveryMode: DeliveryMode;
  contactPhase: ContactPhase;
  sentAttemptMade: number;
  sendDate: string;
}

interface PublicRegistryResponseDetails {
  category: TimelineCategory;
  taxId: string;
  digitalAddress: DigitalAddress;
  physicalAddress: PhysicalAddress;
}

interface RecivedDetails {
  category: TimelineCategory;
  taxId: string;
  recipients: Array<NotificationDetailRecipient>;
  documentsDigests: Array<{
    sha256: string;
  }>;
  f24Digests: {
    flatRate: {
      sha256: string;
    };
    digital: {
      sha256: string;
    };
    analog: {
      sha256: string;
    };
  };
}

interface RequestRefusedDetails {
  category: TimelineCategory;
  errors: Array<string>;
}

interface DigitalAddressInfo {
  address: DigitalAddress;
  addressSource: AddressSource;
  sentAttemptMade: number;
  lastAttemptDate: string;
}

interface ScheduleWorkflowDetails {
  category: TimelineCategory;
  taxId: string;
  lastAttemptInfo?: DigitalAddressInfo;
}

export interface SendCourtesyMessageDetails {
  category: TimelineCategory;
  taxId: string;
  address: DigitalAddress;
  sendDate: string;
}

export interface SendDigitalDetails {
  category: TimelineCategory;
  taxId: string;
  address?: DigitalAddress;
  addresses?: Array<{
    address: DigitalAddress;
    when: string;
  }>;
  addressSource?: AddressSource;
  retryNumber?: number;
  downstreamId?: {
    systemId: string;
    messageId: string;
  };
  errors?: Array<string>;
  responseStatus?: 'OK' | 'KO';
  notificationDate?: string;
}

export interface NotificationDetailRecipient {
  recipientType: RecipientType;
  taxId: string;
//  creditorTaxId: string;
  denomination: string;
  digitalDomicile?: DigitalAddress;
  physicalAddress?: PhysicalAddress;
  payment: NotificationDetailPayment;
//  token: string;
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
  title: string; // left for back-compatibility - to be removed
}

export interface NotificationPaymentAttachment {
  digests: {
    sha256: string;
  };
  contentType: string;
  ref: {
    key: string;
    versionToken: string;
  };
}

export enum NotificationFeePolicy {
  FLAT_RATE = 'FLAT_RATE',
  DELIVERY_MODE = 'DELIVERY_MODE',
}

export interface NotificationDetailPayment {
  notificationFeePolicy: NotificationFeePolicy;
  noticeCode?: string;
  creditorTaxId: string;
  pagoPaForm: NotificationPaymentAttachment;
  f24flatRate?: NotificationPaymentAttachment;
  f24standard?: NotificationPaymentAttachment;
}

export interface NotificationStatusHistory {
  status: NotificationStatus;
  activeFrom: string;
  relatedTimelineElements: Array<string>;
  // only fe
  steps?: Array<INotificationDetailTimeline>;
}

export enum TimelineCategory {
  REQUEST_ACCEPTED = 'REQUEST_ACCEPTED',
  SEND_COURTESY_MESSAGE = 'SEND_COURTESY_MESSAGE',
  NOTIFICATION_PATH_CHOOSE = 'NOTIFICATION_PATH_CHOOSE',
  GET_ADDRESS = 'GET_ADDRESS',
  PUBLIC_REGISTRY_CALL = 'PUBLIC_REGISTRY_CALL',
  PUBLIC_REGISTRY_RESPONSE = 'PUBLIC_REGISTRY_RESPONSE',
  SCHEDULE_ANALOG_WORKFLOW = 'SCHEDULE_ANALOG_WORKFLOW',
  SCHEDULE_DIGITAL_WORKFLOW = 'SCHEDULE_DIGITAL_WORKFLOW',
  SEND_DIGITAL_DOMICILE = 'SEND_DIGITAL_DOMICILE',
  SEND_DIGITAL_DOMICILE_FEEDBACK = 'SEND_DIGITAL_DOMICILE_FEEDBACK',
  SEND_DIGITAL_FEEDBACK = 'SEND_DIGITAL_FEEDBACK',
  SEND_DIGITAL_DOMICILE_FAILURE = 'SEND_DIGITAL_DOMICILE_FAILURE',
  REFINEMENT = 'REFINEMENT',
  SCHEDULE_REFINEMENT = 'SCHEDULE_REFINEMENT',
  DIGITAL_SUCCESS_WORKFLOW = 'DIGITAL_SUCCESS_WORKFLOW',
  DIGITAL_FAILURE_WORKFLOW = 'DIGITAL_FAILURE_WORKFLOW',
  ANALOG_SUCCESS_WORKFLOW = 'ANALOG_SUCCESS_WORKFLOW',
  ANALOG_FAILURE_WORKFLOW = 'ANALOG_FAILURE_WORKFLOW',
  SEND_SIMPLE_REGISTERED_LETTER = 'SEND_SIMPLE_REGISTERED_LETTER',
  END_OF_DIGITAL_DELIVERY_WORKFLOW = 'END_OF_DIGITAL_DELIVERY_WORKFLOW',
  END_OF_ANALOG_DELIVERY_WORKFLOW = 'END_OF_ANALOG_DELIVERY_WORKFLOW',
  NOTIFICATION_VIEWED = 'NOTIFICATION_VIEWED',
  SEND_ANALOG_DOMICILE = 'SEND_ANALOG_DOMICILE',
  SEND_PAPER_FEEDBACK = 'SEND_PAPER_FEEDBACK',
  PAYMENT = 'PAYMENT',
  COMPLETELY_UNREACHABLE = 'COMPLETELY_UNREACHABLE',
  REQUEST_REFUSED = 'REQUEST_REFUSED',
}

export enum TimelineError {
  OK = "OK",
  RETRYABLE_FAIL = "RETRYABLE_FAIL"
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
  province: string;
  foreignState: string;
}

export enum DigitalDomicileType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
}

export enum RecipientType {
  PF = 'PF',
  PG = 'PG',
}

export enum DeliveryMode {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG ',
}

export enum AddressSource {
  PLATFORM = 'PLATFORM',
  SPECIAL = 'SPECIAL',
  GENERAL = 'GENERAL ',
}

export enum LegalFactType {
  SENDER_ACK = 'SENDER_ACK',
  DIGITAL_DELIVERY = 'DIGITAL_DELIVERY',
  ANALOG_DELIVERY = 'ANALOG_DELIVERY',
  RECIPIENT_ACCESS = 'RECIPIENT_ACCESS',
}

export interface LegalFactId {
  key: string;
  type: LegalFactType;
}

export enum PhysicalCommunicationType {
  SIMPLE_REGISTERED_LETTER = 'SIMPLE_REGISTERED_LETTER',
  REGISTERED_LETTER_890 = 'REGISTERED_LETTER_890',
}

export interface NotificationDetailTableRow {
  id: number;
  label: string;
  value: ReactNode;
}
