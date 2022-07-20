import { NotificationDetail, parseNotificationDetail } from '@pagopa-pn/pn-commons';
import { User } from '../redux/auth/types';
import { Delegator } from '../redux/delegation/types';
import { NotificationDetailForRecipient } from './../types/NotificationDetail';

function fiscalNumberDaDelegator(
  delegatorsFromStore: Array<Delegator>,
  mandateId: string
): string | undefined {
  const currentDelegatorFromStore = delegatorsFromStore
    ? delegatorsFromStore.find((delegatorFromStore) => delegatorFromStore.mandateId === mandateId)
    : null;
  return currentDelegatorFromStore ? currentDelegatorFromStore.delegator?.fiscalCode : undefined;
}

function fiscalNumberDaUser(currentUser: User): string {
  return currentUser.fiscal_number;
}


export function parseNotificationDetailForRecipient(
  notification: NotificationDetail,
  currentUser: User,
  delegatorsFromStore: Array<Delegator>,
  mandateId: string | undefined
): NotificationDetailForRecipient {
  // determine current recipient
  const fiscalNumberForNotification = mandateId
    ? fiscalNumberDaDelegator(delegatorsFromStore, mandateId)
    : fiscalNumberDaUser(currentUser);
  const candidateCurrentRecipientIndex = notification.recipients.findIndex(
    (recipient) => recipient.taxId === fiscalNumberForNotification
  );
  // if the algorithm does not find the right recipient, it yields the first one
  const currentRecipientIndex =
    candidateCurrentRecipientIndex > -1 ? candidateCurrentRecipientIndex : 0;
  const currentRecipient = notification.recipients[currentRecipientIndex];

  // ... the legalfacts pertaining to other recipients will be epurated here ... PN-1737 ...

  // do the changes common to the pa and pf
  const commonNotificationDetailForFe = parseNotificationDetail(notification);

  return {...commonNotificationDetailForFe, currentRecipient, currentRecipientIndex};
};
