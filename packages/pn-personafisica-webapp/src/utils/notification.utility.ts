import { NotificationDetail, parseNotificationDetail } from '@pagopa-pn/pn-commons';
import {
  UserForParseNotificationDetailForRecipient,
  DelegatorsForParseNotificationDetailForRecipient,
} from './../types/notification.utility';
import { NotificationDetailForRecipient } from './../types/NotificationDetail';

function fiscalNumberDaDelegator(
  delegatorsFromStore: DelegatorsForParseNotificationDetailForRecipient,
  mandateId: string
): string | undefined {
  const currentDelegatorFromStore = delegatorsFromStore
    ? delegatorsFromStore.find((delegatorFromStore) => delegatorFromStore.mandateId === mandateId)
    : null;
  return currentDelegatorFromStore ? currentDelegatorFromStore.delegator?.fiscalCode : undefined;
}

function fiscalNumberDaUser(currentUser: { fiscal_number: string }): string {
  return currentUser.fiscal_number;
}

export function parseNotificationDetailForRecipient(
  notification: NotificationDetail,
  currentUser: UserForParseNotificationDetailForRecipient,
  delegatorsFromStore: DelegatorsForParseNotificationDetailForRecipient,
  mandateId?: string
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

  // do the changes common to the pa and pf
  const commonNotificationDetailForFe = parseNotificationDetail(notification);

  return { ...commonNotificationDetailForFe, currentRecipient, currentRecipientIndex };
}
