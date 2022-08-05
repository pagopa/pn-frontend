import { NotificationDetail, NotificationDetailRecipient } from '@pagopa-pn/pn-commons';

export interface NotificationDetailForRecipient extends NotificationDetail {
  currentRecipient: NotificationDetailRecipient;
  currentRecipientIndex: number;
}
