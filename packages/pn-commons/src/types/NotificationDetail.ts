import { ReactNode } from "react";
import { NotificationStatus } from "./NotificationStatus";

export interface NotificationDetail {
  iun: string;
  paNotificationId: string;
  subject: string;
  sentAt: string;
  cancelledIun: string;
  cancelledByIun: string;
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NotificationDetailDocument>;
  payment: NotificationDetailPayment;
  notificationStatus: NotificationStatus;
  notificationStatusHistory: Array<NotificationStatusHistory>;
  timeline: Array<INotificationDetailTimeline>;
  physicalCommunicationType: PhysicalCommunicationType;
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
}

interface SendPaperDetails {
  category: TimelineCategory;
  taxId: string;
  address: DigitalAddress;
  serviceLevel: PhysicalCommunicationType;
  sentAttemptMade: number;
  investigation: boolean;
  newAddress?: PhysicalAddress;
  errors?: Array<string>;
}

interface BaseDetails {
  category: TimelineCategory;
  taxdId: string;
}

interface AnalogWorkflowDetails {
  category: TimelineCategory;
  taxdId: string;
  address?: PhysicalAddress;
}

interface AddressInfoDetails {
  category: TimelineCategory;
  taxdId: string;
  source: AddressSource;
  isAvailable: boolean;
  attemptDate: string;
  available: boolean;
}

interface NotificationPathChooseDetails {
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

interface SendCourtesyMessageDetails {
  category: TimelineCategory;
  taxId: string;
  address: DigitalAddress;
  sendDate: string;
}

interface SendDigitalDetails {
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
  denomination: string;
  digitalDomicile: DigitalAddress;
  physicalAddress: PhysicalAddress;
  token: string;
}

export interface NotificationDetailDocument {
  digests: {
    sha256: string;
  };
  contentType: string;
  title: string;
}

export enum NotificationFeePolicy {
  FLAT_RATE = 'FLAT_RATE',
  DELIVERY_MODE = 'DELIVERY_MODE',
}

export interface NotificationDetailPayment {
  iuv: string;
  notificationFeePolicy: NotificationFeePolicy;
  f24: {
    flatRate: NotificationDetailDocument;
    digital: NotificationDetailDocument;
    analog: NotificationDetailDocument;
  };
}

export interface NotificationStatusHistory {
  status: NotificationStatus;
  activeFrom: string;
  relatedTimelineElements: Array<string>;
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
}

interface DigitalAddress {
  type: DigitalDomicileType;
  address: string;
}

interface PhysicalAddress {
  at: string;
  address: string;
  addressDetails: string;
  zip: string;
  municipality: string;
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

export interface NotificationDetailTimelineData extends NotificationStatusHistory {
  steps: Array<INotificationDetailTimeline>
};