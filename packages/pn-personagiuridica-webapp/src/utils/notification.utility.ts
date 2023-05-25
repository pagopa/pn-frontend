import { NotificationDetail, parseNotificationDetail } from '@pagopa-pn/pn-commons';

import { NotificationDetailForRecipient } from '../models/NotificationDetail';

export function parseNotificationDetailForRecipient(
  notification: NotificationDetail,
): NotificationDetailForRecipient {
  // determine current recipient
  // ----------------------------------------------
  // PN-6104 - we chose to trust the notification detail API, the recipients in its response must be
  // an array with exactly one "complete" record, and all the others being just a placeholder with recipientType only.
  // The alternative of searching the whole set of delegators of the logged user/company to find the one corresponding
  // with the mandateId included in the notification detail, would be too onerous 
  // (since a PG user/company can be delegator of many different entities)
  // and useless
  // ----------------------------------------------
  const properRecipientIndexes = notification.recipients.reduce(
    (indexes, recipient, currentIndex) => recipient.taxId && recipient.denomination ? [...indexes, currentIndex] : indexes, 
    [] as Array<number>
  );
  const currentRecipientIndex = properRecipientIndexes.length === 1 ? properRecipientIndexes[0] : -1;
  const currentRecipient = notification.recipients[currentRecipientIndex];

  // do the changes common to the pa and pf
  const commonNotificationDetailForFe = parseNotificationDetail(notification);

  return {
    ...commonNotificationDetailForFe,
    otherDocuments: commonNotificationDetailForFe.otherDocuments?.filter(
      (d) => d.recIndex === currentRecipientIndex
    ),
    currentRecipient,
    currentRecipientIndex,
  };
}

