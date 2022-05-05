import {
  NotificationDetailRecipient,
  NotificationFeePolicy,
  PhysicalCommunicationType,
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

export interface NewNotificationBe {
  paNotificationId: string;
  subject: string;
  description?: string;
  cancelledIun?: string;
  recipients: Array<NotificationDetailRecipient>;
  documents: Array<NewNotificationDocument>;
  payment: NewNotificationPayment;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
}

export interface NewNotificationFe extends NewNotificationBe {
  paymentMode: PaymentModel;
}