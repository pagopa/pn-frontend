import { Item } from '@pagopa-pn/pn-commons';

import { Delegation } from '../redux/delegation/types';
/**
 * Maps Delegation object to Item, in order to be visualised in an ItemCard or ItemsTable component
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
    startDate: delegation.datefrom,
    endDate: delegation.dateto,
    email: delegation.email,
    visibilityIds: delegation.visibilityIds.map((f: any) => f.name),
    status: delegation.status,
  }));
}
