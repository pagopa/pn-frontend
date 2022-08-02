import {
  DigitalDomicileType,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  RecipientType,
  NotificationDetailDocument
} from '@pagopa-pn/pn-commons';

export enum PaymentModel {
  PAGO_PA_NOTICE = 'PAGO_PA_NOTICE',
  PAGO_PA_NOTICE_F24_FLATRATE = 'PAGO_PA_NOTICE_F24_FLATRATE',
  PAGO_PA_NOTICE_F24 = 'PAGO_PA_NOTICE_F24',
}

export interface NewNotificationBe {
  notificationFeePolicy: NotificationFeePolicy;
  idempotenceToken?: string;
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  cancelledIun?: string;
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NotificationDetailDocument>;
  physicalCommunicationType: PhysicalCommunicationType;
  senderDenomination?: string;
  senderTaxId?: string;
  group?: string;
}

export interface NewNotificationFe extends NewNotificationBe {
  paymentMode: PaymentModel;
}

export interface FormAttachment {
  id: string;
  idx: number;
  name: string;
  file: {
    size?: number;
    name?: string;
    uint8Array?: Uint8Array;
    sha256: {
      hashBase64: string;
      hashHex: string;
    };
  };
}

export interface FormRecipient {
  idx: number;
  recipientType: RecipientType;
  taxId: string;
  creditorTaxId: string;
  noticeCode: string;
  firstName: string;
  lastName: string;
  type: DigitalDomicileType;
  digitalDomicile: string;
  at?: string;
  address: string;
  houseNumber: string;
  addressDetails?: string;
  zip: string;
  municipality: string;
  municipalityDetails?: string;
  province: string;
  foreignState: string;
  showDigitalDomicile?: boolean;
  showPhysicalAddress?: boolean;
}

export interface UploadAttachmentParams {
  key: string;
  contentType: string;
  file: Uint8Array | undefined;
  sha256: string;
}

export interface UploadPayementParams {
  [key: string]: {
    pagoPaForm: UploadAttachmentParams;
    f24flatRate: UploadAttachmentParams;
    f24standard: UploadAttachmentParams;
  };
}

export interface UpaloadPaymentResponse {
  [key: string]: {
    pagoPaForm: NotificationDetailDocument;
    f24flatRate?: NotificationDetailDocument;
    f24standard?: NotificationDetailDocument;
  };
}

export interface NewNotificationResponse {
  notificationRequestId: string;
  paProtocolNumber: string;
  idempotenceToken: string;
}


