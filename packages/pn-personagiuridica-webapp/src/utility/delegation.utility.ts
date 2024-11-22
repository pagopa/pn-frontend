import { Row, formatDate } from '@pagopa-pn/pn-commons';

import { Delegate, DelegationData, Delegator, Person } from '../models/Deleghe';

/**
 * Maps Delegation object to Item, in order to be visualised in an PnCardsList or PnTable component
 * @param  {Array<Delegate | Delegator>} delegations
 * @param  {boolean} isDelegator
 * @returns Array<Row>
 */
export default function delegationToItem<T extends Delegate | Delegator>(
  delegations: Array<T>
): Array<Row<DelegationData>> {
  return delegations.map((delegation: T) => ({
    id: delegation.mandateId,
    name: getFirstName(delegation),
    // la data arriva nel formato YYYY-MM-DDZ rimuovere slice in caso di rimozione di Z
    startDate: formatDate(delegation.datefrom.slice(0, 10)),
    endDate: formatDate(delegation.dateto),
    visibilityIds: delegation.visibilityIds.map(
      (entity: { name: string; uniqueIdentifier: string }) => entity.name
    ),
    status: delegation.status,
    verificationCode: delegation.verificationCode,
    groups: delegation.groups ?? [],
  }));
}

export function generateVCode() {
  const crypto = window.crypto;
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array).toString().slice(0, 5);
}

export function sortDelegations<T extends Delegate | Delegator>(
  order: string,
  sortAttr: string,
  values: Array<T>
) {
  /* eslint-disable-next-line functional/immutable-data */
  return values.sort((a: T, b: T) => {
    const orderDirection = order === 'desc' ? 1 : -1;
    if (sortAttr === 'endDate') {
      const dateA = new Date(a.dateto).getTime();
      const dateB = new Date(b.dateto).getTime();
      return orderDirection * (dateB - dateA);
    }
    return orderDirection * compareDelegationsStrings(a, b, sortAttr);
  });
}

function compareDelegationsStrings<T extends Delegate | Delegator>(a: T, b: T, orderAttr: string) {
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

function compareOrderAttribute(person: Person, orderAttr: string) {
  return orderAttr === 'name'
    ? person.displayName.toLowerCase()
    : person[orderAttr as keyof Person] ?? '';
}

function getFirstName<T extends Delegate | Delegator>(delegation: T): string {
  if ('delegator' in delegation && delegation.delegator) {
    return `${delegation.delegator?.displayName}`;
  } else if ('delegate' in delegation && delegation.delegate) {
    return `${delegation.delegate?.displayName}`;
  }
  return '';
}
