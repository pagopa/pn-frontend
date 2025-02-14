import {
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

// NotificationDigital Domicile Type 
export enum NewNotificationDigitalAddressType {
  PEC = 'PEC',
}

// New Notification
export interface NewNotificationRecipient {
  id: string;
  idx: number;
  recipientType: RecipientType;
  taxId: string;
  firstName: string;
  lastName: string;
  type: NewNotificationDigitalAddressType;
  digitalDomicile: string;
  address: string;
  houseNumber: string;
  addressDetails?: string;
  zip: string;
  municipality: string;
  municipalityDetails?: string;
  province: string;
  foreignState: string;
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

export interface NewNotification extends NewNotificationBilingualism {
  notificationFeePolicy: NotificationFeePolicy;
  idempotenceToken?: string;
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  cancelledIun?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  senderDenomination: string;
  senderTaxId: string;
  group?: string;
  taxonomyCode: string;
  paymentMode?: PaymentModel;
  recipients: Array<NewNotificationRecipient>;
  documents: Array<NewNotificationDocument>;
  payment?: { [key: string]: PaymentObject };
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

export interface PreliminaryInformationsPayload extends NewNotificationBilingualism {
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentMode: PaymentModel;
  taxonomyCode: string;
  senderDenomination?: string;
}

export interface UploadDocumentParams {
  id: string;
  key: string;
  contentType: string;
  file: Uint8Array | undefined;
  sha256: string;
}

export interface UploadPaymentResponse {
  [key: string]: {
    pagoPaForm: UploadDocumentsResponse;
    f24flatRate?: UploadDocumentsResponse;
    f24standard?: UploadDocumentsResponse;
  };
}

export interface UploadDocumentsResponse {
  [id: string]: {
    key: string;
    versionToken: string;
  };
}

export const BILINGUALISM_LANGUAGES = ['de', 'sl', 'fr'];
export const NewNotificationLangOther = 'other';
