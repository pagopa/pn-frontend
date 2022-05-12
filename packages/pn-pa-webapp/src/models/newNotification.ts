import {
  DigitalDomicileType,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

export enum PaymentModel {
  PAGO_PA_NOTICE = 'PAGO_PA_NOTICE',
  PAGO_PA_NOTICE_F24_FLATRATE = 'PAGO_PA_NOTICE_F24_FLATRATE',
  PAGO_PA_NOTICE_F24 = 'PAGO_PA_NOTICE_F24',
}

interface NewNotificationDocument {
  digests: {
    sha256: string;
  };
  contentType: string;
  ref: {
    key: string;
    versionToken: string;
  };
}

export interface NewNotificationPayment {
  notificationFeePolicy: NotificationFeePolicy;
  noticeCode: string;
  creditorTaxId: string;
  pagoPaForm: NewNotificationDocument;
  f24flatRate: NewNotificationDocument;
  f24digital: NewNotificationDocument;
  f24digitalWithRs: NewNotificationDocument;
  f24analogRaccSingle: NewNotificationDocument;
  f24analogRaccDouble: NewNotificationDocument;
  f24analogRiSingle: NewNotificationDocument;
  f24analogRiDouble: NewNotificationDocument;
}

export interface NewNotificationRecipient extends NotificationDetailRecipient {
  payment?: NewNotificationPayment;
}

export interface NewNotificationBe {
  idempotenceToken?: string;
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  cancelledIun?: string;
  recipients: Array<NewNotificationRecipient>;
  documents: Array<NewNotificationDocument>;
  physicalCommunicationType: PhysicalCommunicationType;
  senderDenomination?: string;
  senderTaxId?: string;
  group?: string;
}

export interface NewNotificationFe extends NewNotificationBe {
  paymentMode: PaymentModel;
}

export interface FormRecipient {
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
