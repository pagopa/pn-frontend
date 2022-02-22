import { NotificationStatus } from "../dashboard/types";

enum DigitalDomicileType {
  PEC = 'PEC',
  EMAIL = 'EMAIL'
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

interface NotificationDetailRecipient {
  taxId: string;
  denomination: string;
  digitalDomicile: DigitalAddress;
  physicalAddress: PhysicalAddress;
  token: string;
}

interface NotificationDetailDocument {
  digests: {
    sha256: string;
  };
  contentType: string;
}

enum NotificationFeePolicy {
  FLAT_RATE = 'FLAT_RATE',
  DELIVERY_MODE = 'DELIVERY_MODE'
}

interface NotificationDetailPayment {
  iuv: string;
  notificationFeePolicy: NotificationFeePolicy;
  f24: {
    flatRate: NotificationDetailDocument;
    digital: NotificationDetailDocument;
    analog: NotificationDetailDocument;
  }
}

interface NotificationStatusHistory {
  status: NotificationStatus;
  activeFrom: string;
}

enum TimelineCategory {
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
  COMPLETELY_UNREACHABLE = 'COMPLETELY_UNREACHABLE'
}

enum DeliveryMode {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG '
}

enum AddressSource {
  PLATFORM = 'PLATFORM',
  SPECIAL = 'SPECIAL',
  GENERAL = 'GENERAL '
}

interface RecivedDetails {
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

interface NotificationPathChooseDetails {
  taxId: string;
  deliveryMode: DeliveryMode;
  physicalAddress: PhysicalAddress;
  platform: DigitalAddress;
  special: DigitalAddress;
  general: DigitalAddress;
  courtesyAddresses: Array<DigitalAddress>;
}

interface SendDigitalDetails {
  taxId: string;
  address: DigitalAddress;
  addressSource: AddressSource;
  retryNumber: number;
  downstreamId: {
    systemId: string;
    messageId: string;
  }
}

interface SendDigitalFeedbackDetails {
  taxId: string;
  address: DigitalAddress;
  addressSource: AddressSource;
  retryNumber: number;
  downstreamId: {
    systemId: string;
    messageId: string;
  };
  errors: Array<string>
}

interface NotificationDetailTimeline {
  elementId: string;
  timestamp: string;
  category: TimelineCategory;
  details: RecivedDetails | NotificationPathChooseDetails | SendDigitalDetails | SendDigitalFeedbackDetails;
}

enum PhysicalCommunicationType {
  SIMPLE_REGISTERED_LETTER = 'SIMPLE_REGISTERED_LETTER',
  REGISTERED_LETTER_890 = 'REGISTERED_LETTER_890'
}

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
  timeline: Array<NotificationDetailTimeline>;
  physicalCommunicationType: PhysicalCommunicationType
}