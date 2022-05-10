import {
  DigitalDomicileType,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

interface NewNotificationDocument {
  digests: {
    sha256: string;
  };
  contentType: string;
  title: string;
  body: string;
  ref: {
    key: string;
    versionToken: string;
  };
}

export interface NewNotificationPayment {
  iuv: string;
  notificationFeePolicy: NotificationFeePolicy;
  f24: {
    flatRate: NewNotificationDocument;
    digital: NewNotificationDocument;
    analog: NewNotificationDocument;
  };
}

export interface NewNotification {
  paNotificationId: string;
  subject: string;
  cancelledIun?: string;
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NewNotificationDocument>;
  payment: NewNotificationPayment;
  physicalCommunicationType: PhysicalCommunicationType;
  group: string;
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
  token: string;
  showDigitalDomicile?: string;
  showPhysicalAddress?: string;
}
