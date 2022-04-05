import { formatDate, Item } from '@pagopa-pn/pn-commons';

import { Delegation, Person } from '../redux/delegation/types';
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

export function compareDelegationsStrings(
  a: Delegation,
  b: Delegation,
  orderAttr: string,
  key: 'delegate' | 'delegator'
) {
  // TODO: change when displayName can be retrieved
  const delegate1 =
    orderAttr === 'name' ? a[key].firstName.toLowerCase() : a[key][orderAttr as keyof Person] || '';
  const delegate2 =
    orderAttr === 'name' ? b[key].firstName.toLowerCase() : b[key][orderAttr as keyof Person] || '';
  return delegate1 < delegate2 ? 1 : -1;
}

export function sortDelegations(
  order: string,
  sortAttr: string,
  values: Array<Delegation>,
  isDelegate: boolean
) {
  /* eslint-disable-next-line functional/immutable-data */
  return values.sort((a: Delegation, b: Delegation) => {
    const orderDirection = order === 'desc' ? 1 : -1;
    if (sortAttr === 'endDate') {
      const dateA = new Date(a.dateto).getTime();
      const dateB = new Date(b.dateto).getTime();
      return orderDirection * (dateB - dateA);
    }
    return (
      orderDirection *
      compareDelegationsStrings(a, b, sortAttr, isDelegate ? 'delegate' : 'delegator')
    );
  });
}
