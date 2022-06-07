import { ReactNode } from 'react';
import { NotificationStatus } from './NotificationStatus';

// =========== START TEMP: WAITING FOR PAYMENT APIs DEFINITION ===========

export enum PaymentStatus {
  REQUIRED = 'REQUIRED',
  SUCCEEDED = 'SUCCEEDED',
  INPROGRESS = 'INPROGRESS',
  FAILED = 'FAILED',
}

export interface PaymentDetail {
  status: PaymentStatus;
  amount?: number;
}

// =========== END TEMP: WAITING FOR PAYMENT APIs DEFINITION ===========

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
}

export interface INotificationDetailTimeline {
  elementId: string;
  timestamp: string;
  legalFactsIds?: Array<LegalFactId>;
  category: TimelineCategory;
  details:
    | BaseDetails
    | AnalogWorkflowDetails
    | DigitalWorkflowDetails
    | AddressInfoDetails
    | PublicRegistryCallDetails
    | PublicRegistryResponseDetails
    | RequestRefusedDetails
    | ScheduleDigitalWorkflowDetails
    | SendCourtesyMessageDetails
    | SendDigitalDetails
    | SendPaperDetails;
    // only fe
  hidden?: boolean;
}

export interface SendPaperDetails extends BaseDetails {
  physicalAddress: PhysicalAddress;
  serviceLevel: PhysicalCommunicationType;
  sentAttemptMade: number;
  investigation: boolean;
  newAddress?: PhysicalAddress;
  errors?: Array<string>;
}

interface BaseDetails {
  recIndex?: number;
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

interface RequestRefusedDetails {
  errors: Array<string>;
}

interface ScheduleDigitalWorkflowDetails extends DigitalAddress {
  digitalAddress: DigitalAddress
  digitalAddressSource: AddressSource;
  sentAttemptMade: number;
  lastAttemptDate: string;
}

export interface SendCourtesyMessageDetails extends BaseDetails {
  digitalAddress: DigitalAddress;
  sendDate: string;
}

export interface SendDigitalDetails extends BaseDetails {
  digitalAddress?: DigitalAddress;
  digitalAddressSource?: AddressSource;
  retryNumber?: number;
  downstreamId?: {
    systemId: string;
    messageId: string;
  };
  responseStatus?: 'OK' | 'KO';
  notificationDate?: string;
  errors?: Array<string>;
}

export interface NotificationDetailRecipient {
  recipientType: RecipientType;
  taxId: string;
  denomination: string;
  digitalDomicile?: DigitalAddress;
  physicalAddress?: PhysicalAddress;
  payment?: NotificationDetailPayment
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
}

export enum NotificationFeePolicy {
  FLAT_RATE = 'FLAT_RATE',
  DELIVERY_MODE = 'DELIVERY_MODE',
}

export interface NotificationDetailPayment {
  noticeCode?: string;
  creditorTaxId: string;
  pagoPaForm: NotificationDetailDocument;
  f24flatRate?: NotificationDetailDocument;
  f24standard?: NotificationDetailDocument;
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
  GET_ADDRESS = 'GET_ADDRESS',
  PUBLIC_REGISTRY_CALL = 'PUBLIC_REGISTRY_CALL',
  PUBLIC_REGISTRY_RESPONSE = 'PUBLIC_REGISTRY_RESPONSE',
  SCHEDULE_ANALOG_WORKFLOW = 'SCHEDULE_ANALOG_WORKFLOW',
  SCHEDULE_DIGITAL_WORKFLOW = 'SCHEDULE_DIGITAL_WORKFLOW',
  SEND_DIGITAL_DOMICILE = 'SEND_DIGITAL_DOMICILE',
  SEND_DIGITAL_DOMICILE_FEEDBACK = 'SEND_DIGITAL_DOMICILE_FEEDBACK',
  SEND_DIGITAL_FEEDBACK = 'SEND_DIGITAL_FEEDBACK',
  REFINEMENT = 'REFINEMENT',
  SCHEDULE_REFINEMENT = 'SCHEDULE_REFINEMENT',
  DIGITAL_SUCCESS_WORKFLOW = 'DIGITAL_SUCCESS_WORKFLOW',
  DIGITAL_FAILURE_WORKFLOW = 'DIGITAL_FAILURE_WORKFLOW',
  ANALOG_SUCCESS_WORKFLOW = 'ANALOG_SUCCESS_WORKFLOW',
  ANALOG_FAILURE_WORKFLOW = 'ANALOG_FAILURE_WORKFLOW',
  SEND_SIMPLE_REGISTERED_LETTER = 'SEND_SIMPLE_REGISTERED_LETTER',
  NOTIFICATION_VIEWED = 'NOTIFICATION_VIEWED',
  SEND_ANALOG_DOMICILE = 'SEND_ANALOG_DOMICILE',
  SEND_PAPER_FEEDBACK = 'SEND_PAPER_FEEDBACK',
  PAYMENT = 'PAYMENT',
  COMPLETELY_UNREACHABLE = 'COMPLETELY_UNREACHABLE',
  REQUEST_REFUSED = 'REQUEST_REFUSED'
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
}

export enum RecipientType {
  PF = 'PF',
  PG = 'PG',
}

enum DeliveryMode {
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
  category: LegalFactType;
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

export type DigitalDetails = DigitalWorkflowDetails | PublicRegistryResponseDetails | ScheduleDigitalWorkflowDetails | SendCourtesyMessageDetails | SendDigitalDetails;

export type AnalogDetails = SendPaperDetails | AnalogWorkflowDetails | PublicRegistryResponseDetails;