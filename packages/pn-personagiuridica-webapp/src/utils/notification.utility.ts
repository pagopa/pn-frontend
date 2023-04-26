import { NotificationDetail, parseNotificationDetail } from '@pagopa-pn/pn-commons';

import { NotificationDetailForRecipient } from '../models/NotificationDetail';
import { Delegator } from '../models/Deleghe';

function fiscalNumberDaDelegator(
  delegatorsFromStore: Array<Delegator>,
  mandateId: string
): string | undefined {
  const currentDelegatorFromStore = delegatorsFromStore
    ? delegatorsFromStore.find((delegatorFromStore) => delegatorFromStore.mandateId === mandateId)
    : null;
  return currentDelegatorFromStore ? currentDelegatorFromStore.delegator?.fiscalCode : undefined;
}

export function parseNotificationDetailForRecipient(
  notification: NotificationDetail,
  currentUserTaxId: string,
  delegatorsFromStore: Array<Delegator>,
  mandateId?: string
): NotificationDetailForRecipient {
  // determine current recipient
  const fiscalNumberForNotification = mandateId
    ? fiscalNumberDaDelegator(delegatorsFromStore, mandateId)
    : currentUserTaxId;
  const candidateCurrentRecipientIndex = notification.recipients.findIndex(
    (recipient) => recipient.taxId === fiscalNumberForNotification
  );
  // if the algorithm does not find the right recipient, it yields the first one
  const currentRecipientIndex =
    candidateCurrentRecipientIndex > -1 ? candidateCurrentRecipientIndex : 0;
  const currentRecipient = notification.recipients[currentRecipientIndex];

  // PN-1737 - epuration of the legalfacts pertaining to other recipients will be epurated here ...  ...
  const cleanedTimeline = notification.timeline.map((timelineElement) => {
    const mustCleanLegalFactsIds =
      timelineElement.legalFactsIds != null &&
      timelineElement.details?.recIndex != null &&
      timelineElement.details.recIndex !== currentRecipientIndex;
    return timelineElement.legalFactsIds
      ? {
          ...timelineElement,
          legalFactsIds: mustCleanLegalFactsIds ? [] : timelineElement.legalFactsIds,
        }
      : timelineElement;
  });
  const notificationClone = { ...notification, timeline: cleanedTimeline };

  // do the changes common to the pa and pf
  const commonNotificationDetailForFe = parseNotificationDetail(notificationClone);

  return {
    ...commonNotificationDetailForFe,
    otherDocuments: commonNotificationDetailForFe.otherDocuments?.filter(
      (d) => d.recIndex === currentRecipientIndex
    ),
    currentRecipient,
    currentRecipientIndex,
  };
}
