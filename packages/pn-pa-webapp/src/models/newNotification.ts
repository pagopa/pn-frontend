import { NotificationDetailRecipient, NotificationFeePolicy, PhysicalCommunicationType } from "@pagopa-pn/pn-commons";

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
  }
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