import { PhysicalCommunicationType, RecipientType } from '@pagopa-pn/pn-commons';

import { NotificationAttachmentBodyRef } from '../generated-client/notifications';

export enum PaymentModel {
  PAGO_PA = 'PAGO_PA',
  F24 = 'F24',
  PAGO_PA_F24 = 'PAGO_PA_F24',
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

export enum PagoPaIntegrationMode {
  NONE = 'NONE',
  SYNC = 'SYNC',
  ASYNC = 'ASYNC',
}

export interface NewNotificationDocumentFile {
  data?: File;
  sha256: {
    hashBase64: string;
    hashHex: string;
  };
}

export interface NewNotificationDocumentRef {
  key: string;
  versionToken: string;
}

export interface NewNotificationDocument {
  id: string;
  idx: number;
  contentType: string;
  name: string;
  file: NewNotificationDocumentFile;
  ref: NewNotificationDocumentRef;
}

export interface NewNotificationPagoPaPayment {
  id: string;
  idx: number;
  contentType: string;
  creditorTaxId: string;
  noticeCode: string;
  applyCost: boolean;
  file: NewNotificationDocumentFile;
  ref: NewNotificationDocumentRef;
}

export interface NewNotificationF24Payment extends NewNotificationDocument {
  applyCost: boolean;
}

export interface NewNotificationPayment {
  pagoPa?: NewNotificationPagoPaPayment;
  f24?: NewNotificationF24Payment;
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
  payments?: Array<NewNotificationPayment>;
  debtPosition?: PaymentModel;
}

export interface NewNotification extends NewNotificationBilingualism {
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
  recipients: Array<NewNotificationRecipient>;
  documents: Array<NewNotificationDocument>;
  paFee?: string;
  vat?: number;
  notificationFeePolicy: NotificationFeePolicy;
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
  [id: string]: NotificationAttachmentBodyRef;
}

export type RecipientPaymentsFormValues = {
  [taxId: string]: {
    pagoPa: Array<NewNotificationPagoPaPayment>;
    f24: Array<NewNotificationF24Payment>;
  };
};

export type PaymentMethodsFormValues = {
  notificationFeePolicy: NotificationFeePolicy;
  paFee: string | undefined;
  vat: number | undefined;
  pagoPaIntMode: PagoPaIntegrationMode;
  recipients: RecipientPaymentsFormValues;
};

export const BILINGUALISM_LANGUAGES = ['de', 'sl', 'fr'];
export const NewNotificationLangOther = 'other';

export const VAT = [4, 5, 10, 22];
