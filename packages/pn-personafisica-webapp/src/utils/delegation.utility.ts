import { formatDate, Item } from '@pagopa-pn/pn-commons';
import { Delegation, Person } from '../redux/delegation/types';

/**
 * Maps Delegation object to Item, in order to be visualised in an ItemsCard or ItemsTable component
 * @param  {Array<Delegation>} delegations
 * @param  {boolean} isDelegator
 * @returns Array<Item>
 */

export default function delegationToItem(delegations: Array<Delegation>): Array<Item> {
  // TODO to be tested
  return delegations.map((delegation: Delegation) => ({
    id: delegation.mandateId,
    name: getFirstName(delegation),
    // la data arriva nel formato YYYY-MM-DDZ rimuovere slice in caso di rimozione di Z
    startDate: formatDate(delegation.datefrom.slice(0, 10)),
    endDate: formatDate(delegation.dateto),
    visibilityIds: delegation.visibilityIds.map((entity) => entity.name),
    status: delegation.status,
    verificationCode: delegation.verificationCode,
  }));
}

export function generateVCode() {
  const crypto = window.crypto;
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array).toString().slice(0, 5);
}

export function compareDelegationsStrings(a: Delegation, b: Delegation, orderAttr: string) {
  if ('delegator' in a && a.delegator && 'delegator' in b && b.delegator) {
    const delegator1 = compareOrderAttribute(a.delegator, orderAttr);
    const delegator2 = compareOrderAttribute(b.delegator, orderAttr);
    return delegator1 < delegator2 ? 1 : -1;
  }
  if ('delegate' in a && a.delegate && 'delegate' in b && b.delegate) {
    const delegate1 = compareOrderAttribute(a.delegate, orderAttr);
    const delegate2 = compareOrderAttribute(b.delegate, orderAttr);
    return delegate1 < delegate2 ? 1 : -1;
  }
  return 0;
}

export function sortDelegations(order: string, sortAttr: string, values: Array<Delegation>) {
  /* eslint-disable-next-line functional/immutable-data */
  return values.sort((a: Delegation, b: Delegation) => {
    const orderDirection = order === 'desc' ? 1 : -1;
    if (sortAttr === 'endDate') {
      const dateA = new Date(a.dateto).getTime();
      const dateB = new Date(b.dateto).getTime();
      return orderDirection * (dateB - dateA);
    }
    return orderDirection * compareDelegationsStrings(a, b, sortAttr);
  });
}

function compareOrderAttribute(person: Person, orderAttr: string) {
  return orderAttr === 'name'
    ? person.displayName.toLowerCase()
    : person[orderAttr as keyof Person] || '';
}

function getFirstName(delegation: Delegation): string {
  if ('delegator' in delegation && delegation.delegator) {
    return `${delegation.delegator?.displayName}`;
  } else if ('delegate' in delegation && delegation.delegate) {
    return `${delegation.delegate?.displayName}`;
  }
  return '';
}
