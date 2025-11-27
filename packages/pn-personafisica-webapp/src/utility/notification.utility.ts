import { AppRouteParams, EventNotificationSource, NotificationDetail } from '@pagopa-pn/pn-commons';

import { NotificationDetailForRecipient } from '../models/NotificationDetail';
import { Delegator } from '../redux/delegation/types';

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

  return {
    ...notification,
    otherDocuments: notification.otherDocuments?.filter(
      (d) => d.recIndex === currentRecipientIndex
    ),
    currentRecipient,
    currentRecipientIndex,
  };
}

export const appRouteParamToEventSource = (
  param: AppRouteParams | undefined
): EventNotificationSource | undefined => {
  if (param === AppRouteParams.AAR) {
    return 'QRcode';
  }
  if (param === AppRouteParams.RETRIEVAL_ID) {
    return '3Papp';
  }
  return undefined;
};
