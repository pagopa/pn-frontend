import { formatDate, Item } from '@pagopa-pn/pn-commons';
import {Delegation, Person } from '../redux/delegation/types';


/**
 * Maps Delegation object to Item, in order to be visualised in an ItemsCard or ItemsTable component
 * @param  {Array<Delegation>} delegations
 * @param  {boolean} isDelegator
 * @returns Array<Item>
 */

export default function delegationToItem(
  delegations: Array<Delegation>,
): Array<Item> {
  // TODO to be tested
  return delegations.map((delegation: Delegation) => ({
    id: delegation.mandateId,
    name: 'delegator' in delegation && delegation.delegator
      ? `${delegation.delegator?.firstName} ${delegation.delegator?.lastName}`
      : 'delegate' in delegation && delegation.delegate 
      ? `${delegation.delegate?.firstName} ${delegation.delegate?.lastName}`
      : '',
    startDate: formatDate(delegation.datefrom),
    endDate: formatDate(delegation.dateto),
    email: getEmailFromDelegation(delegation),
    visibilityIds: delegation.visibilityIds.map(
      (entity: { name: string; uniqueIdentifier: string }) => entity.uniqueIdentifier
    ),
    status: delegation.status,
    verificationCode: delegation.verificationCode
  }));
}

export const getEmailFromDelegation = (delegation: Delegation): string => {
  if ('delegator' in delegation && delegation.delegator) {
    return delegation.delegator.email;
  }
  if ('delegate' in delegation && delegation.delegate) {
    return delegation.delegate.email;
  }
  return '';
};

export function generateVCode() {
  const crypto = window.crypto;
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array).toString().slice(0, 5);
}


// eslint-disable-next-line sonarjs/cognitive-complexity
export function compareDelegationsStrings(
  a: Delegation,
  b: Delegation,
  orderAttr: string,
) {
  // TODO: change when displayName can be retrieved
  if (('delegator' in a && (a.delegator)) && ('delegator' in b && (b.delegator))) {
    const delegator1 =
      orderAttr === 'name' ? a.delegator.firstName.toLowerCase() : a.delegator[orderAttr as keyof Person] || '';
    const delegator2 =
      orderAttr === 'name' ? b.delegator.firstName.toLowerCase() : b.delegator[orderAttr as keyof Person] || '';
    return delegator1 < delegator2 ? 1 : -1;
  }
  if (('delegate' in a && (a.delegate)) && ('delegate' in b && (b.delegate))) {
    const delegate1 =
      orderAttr === 'name' ? a.delegate.firstName.toLowerCase() : a.delegate[orderAttr as keyof Person] || '';
    const delegate2 =
      orderAttr === 'name' ? b.delegate.firstName.toLowerCase() : b.delegate[orderAttr as keyof Person] || '';
    return delegate1 < delegate2 ? 1 : -1;
  }
  return 0;
}


export function sortDelegations(
  order: string,
  sortAttr: string,
  values: Array<Delegation>,
) {
  /* eslint-disable-next-line functional/immutable-data */
  return values.sort((a: Delegation, b: Delegation) => {
    const orderDirection = order === 'desc' ? 1 : -1;
    if (sortAttr === 'endDate') {
      const dateA = new Date(a.dateto).getTime();
      const dateB = new Date(b.dateto).getTime();
      return orderDirection * (dateB - dateA);
    };
    return (
      orderDirection *
      compareDelegationsStrings(a, b, sortAttr)
    );
  });
}
