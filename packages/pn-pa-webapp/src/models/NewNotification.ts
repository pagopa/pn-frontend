import {
  DigitalDomicileType,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  RecipientType,
  NotificationDetailDocument,
} from '@pagopa-pn/pn-commons';

export enum PaymentModel {
  PAGO_PA_NOTICE = 'PAGO_PA_NOTICE',
  PAGO_PA_NOTICE_F24_FLATRATE = 'PAGO_PA_NOTICE_F24_FLATRATE',
  PAGO_PA_NOTICE_F24 = 'PAGO_PA_NOTICE_F24',
  NOTHING = 'NOTHING'
}

interface BaseNewNotification {
  notificationFeePolicy: NotificationFeePolicy;
  idempotenceToken?: string;
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  cancelledIun?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  senderDenomination?: string;
  senderTaxId?: string;
  group?: string;
  taxonomyCode: string;
}

// New Notification DTO
export interface NewNotificationDTO extends BaseNewNotification {
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NotificationDetailDocument>;
}

// New Notification
export interface NewNotificationRecipient {
  id: string;
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

export interface NewNotificationDocument {
  id: string;
  idx: number;
  name: string;
  contentType: string;
  file: {
    size?: number;
    name?: string;
    uint8Array?: Uint8Array;
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

export interface NewNotification extends BaseNewNotification {
  paymentMode?: PaymentModel;
  recipients: Array<NewNotificationRecipient>;
  documents: Array<NewNotificationDocument>;
  payment?: { [key: string]: PaymentObject };
}

export interface PaymentObject {
  pagoPaForm: NewNotificationDocument;
  f24flatRate?: NewNotificationDocument;
  f24standard?: NewNotificationDocument;
}

export interface NewNotificationResponse {
  notificationRequestId: string;
  paProtocolNumber: string;
  idempotenceToken: string;
}
