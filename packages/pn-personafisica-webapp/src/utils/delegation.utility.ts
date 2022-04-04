import { formatDate, Item } from '@pagopa-pn/pn-commons';

import { Delegation } from '../redux/delegation/types';
/**
 * Maps Delegation object to Item, in order to be visualised in an ItemsCard or ItemsTable component
 * @param  {Array<Delegation>} delegations
 * @param  {boolean} isDelegator
 * @returns Array<Item>
 */
export default function delegationToItem(
  delegations: Array<Delegation>,
  isDelegator: boolean
): Array<Item> {
  // TODO to be tested
  return delegations.map((delegation: Delegation) => ({
    id: delegation.mandateId,
    name: isDelegator
      ? `${delegation.delegator.firstName} ${delegation.delegator.lastName}`
      : `${delegation.delegate.firstName} ${delegation.delegate.lastName}`,
    startDate: formatDate(delegation.datefrom),
    endDate: formatDate(delegation.dateto),
    email: isDelegator ? delegation.delegator.email : delegation.delegate.email,
    visibilityIds: delegation.visibilityIds.map(
      (entity: { name: string; uniqueIdentifier: string }) => entity.uniqueIdentifier
    ),
    status: delegation.status,
  }));
}

export function generateVCode() {
  const crypto = window.crypto;
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array).toString().slice(0, 5);
}
