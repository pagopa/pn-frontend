import {
  DigitalDomicileType,
  NotificationDetailDocument,
  NotificationDetailRecipient,
  PhysicalCommunicationType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

export enum PaymentModel {
  PAGO_PA_NOTICE = 'PAGO_PA_NOTICE',
  F24 = 'F24',
  NOTHING = 'NOTHING',
}

export enum NotificationFeePolicy {
  FLAT_RATE = 'FLAT_RATE',
  DELIVERY_MODE = 'DELIVERY_MODE',
}

enum PagoPaIntegrationMode {
  NONE = 'NONE',
  SYNC = 'SYNC',
  ASYNC = 'ASYNC',
}

interface BaseNewNotification {
  notificationFeePolicy?: NotificationFeePolicy;
  idempotenceToken?: string;
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  cancelledIun?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  senderDenomination: string;
  senderTaxId?: string;
  group?: string;
  taxonomyCode: string;
}

// New Notification DTO
export interface NewNotificationDTO extends BaseNewNotification {
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NotificationDetailDocument>;
  additionalLanguages?: Array<string>;
}

export interface NewNotificationPayment {
  pagoPA?: NewNotificationDocument;
  f24?: NewNotificationDocument;
}

// New Notification
export interface NewNotificationRecipient {
  id: string;
  idx: number;
  recipientType: RecipientType;
  taxId: string;
  firstName: string;
  lastName: string;
  type: DigitalDomicileType;
  digitalDomicile: string;
  address: string;
  houseNumber: string;
  addressDetails?: string;
  zip: string;
  municipality: string;
  municipalityDetails?: string;
  province: string;
  foreignState: string;
  payments?: Array<NewNotificationPayment>;
}

export interface NewNotificationDocument {
  id: string;
  idx: number;
  name: string;
  contentType: string;
  file: {
    data?: File;
    sha256: {
      hashBase64: string;
      hashHex: string;
    };
  };
  ref: {
    key: string;
    versionToken: string;
  };
}

export interface NewNotification extends BaseNewNotification, NewNotificationBilingualism {
  recipients: Array<NewNotificationRecipient>;
  documents: Array<NewNotificationDocument>;
  paFee?: number;
  vat?: number;
  pagoPaIntMode?: PagoPaIntegrationMode;
}

export interface NewNotificationBilingualism {
  lang?: 'it' | 'other';
  additionalLang?: string;
  additionalSubject?: string;
  additionalAbstract?: string;
}

export interface PaymentObject {
  pagoPa: NewNotificationDocument;
  f24?: NewNotificationDocument;
}

export interface NewNotificationResponse {
  notificationRequestId: string;
  paProtocolNumber: string;
  idempotenceToken: string;
}

export const BILINGUALISM_LANGUAGES = ['de', 'sl', 'fr'];
export const NewNotificationLangOther = 'other';
