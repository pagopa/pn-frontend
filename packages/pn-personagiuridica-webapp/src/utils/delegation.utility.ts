import { formatDate, Item } from '@pagopa-pn/pn-commons';

import { Delegation } from '../models/Deleghe';

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
    visibilityIds: delegation.visibilityIds.map(
      (entity: { name: string; uniqueIdentifier: string }) => entity.name
    ),
    status: delegation.status,
    verificationCode: delegation.verificationCode,
    groups: delegation.groups || [],
  }));
}

export function generateVCode() {
  const crypto = window.crypto;
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array).toString().slice(0, 5);
}

function getFirstName(delegation: Delegation): string {
  if ('delegator' in delegation && delegation.delegator) {
    return `${delegation.delegator?.displayName}`;
  } else if ('delegate' in delegation && delegation.delegate) {
    return `${delegation.delegate?.displayName}`;
  }
  return '';
}
