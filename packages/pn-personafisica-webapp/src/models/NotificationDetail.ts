import { AppRouteParams, NotificationDetail, NotificationDetailRecipient } from '@pagopa-pn/pn-commons';

export interface NotificationDetailForRecipient extends NotificationDetail {
  currentRecipient: NotificationDetailRecipient;
  currentRecipientIndex: number;
}

export type NotificationDetailRouteState = {
  source?: AppRouteParams; // indicates whether the user arrived to the notification detail page from the QR code
};