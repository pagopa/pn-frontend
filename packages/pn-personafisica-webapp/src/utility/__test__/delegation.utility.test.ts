import crypto from 'crypto';

import { formatDate } from '@pagopa-pn/pn-commons';

import { mandatesByDelegate, mandatesByDelegator } from '../../__mocks__/Delegations.mock';
import delegationToItem, { generateVCode, sortDelegations } from '../delegation.utility';

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: () => crypto.randomInt(2 ** 32),
  },
});

describe('Delegation utility test', () => {
  it('Should convert an delegation array of delegate to an item array - delegate', () => {
    const item = delegationToItem(mandatesByDelegator);
    const expected = mandatesByDelegator.map((delegation) => ({
      id: delegation.mandateId,
      name: delegation.delegate?.displayName,
      // la data arriva nel formato YYYY-MM-DDZ rimuovere slice in caso di rimozione di Z
      startDate: formatDate(delegation.datefrom.slice(0, 10)),
      endDate: formatDate(delegation.dateto),
      visibilityIds: delegation.visibilityIds.map((entity) => entity.name),
      status: delegation.status,
      verificationCode: delegation.verificationCode,
    }));
    expect(item).toStrictEqual(expected);
  });

  it('Should convert an delegation array of delegate to an item array - delegator', () => {
    const item = delegationToItem(mandatesByDelegate);
    const expected = mandatesByDelegate.map((delegation) => ({
      id: delegation.mandateId,
      name: delegation.delegator?.displayName,
      // la data arriva nel formato YYYY-MM-DDZ rimuovere slice in caso di rimozione di Z
      startDate: formatDate(delegation.datefrom.slice(0, 10)),
      endDate: formatDate(delegation.dateto),
      visibilityIds: delegation.visibilityIds.map((entity) => entity.name),
      status: delegation.status,
      verificationCode: delegation.verificationCode,
    }));
    expect(item).toStrictEqual(expected);
  });

  it('Should generate a random code', () => {
    const verificationCode = generateVCode();
    expect(Number(verificationCode)).not.toBeNaN();
    expect(verificationCode.length).toBe(5);
  });

  it('sort delegation by name - delegates', () => {
    // sort ascending
    const sortedCopy = (order: 'asc' | 'desc') =>
      [...mandatesByDelegator].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        if (a.delegate?.displayName === b.delegate?.displayName) {
          return 0;
        }
        return (a.delegate?.displayName! < b.delegate?.displayName! ? -1 : 1) * multiplier;
      });
    let result = sortDelegations('asc', 'name', mandatesByDelegator);
    expect(sortedCopy('asc')).toStrictEqual(result);
    // sort descending
    result = sortDelegations('desc', 'name', mandatesByDelegator);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });

  it('sort delegation by endDate - delegates', () => {
    const sortedCopy = (order: 'asc' | 'desc') =>
      [...mandatesByDelegator].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        const dateA = new Date(a.dateto).getTime();
        const dateB = new Date(b.dateto).getTime();
        return (dateA - dateB) * multiplier;
      });
    let result = sortDelegations('asc', 'endDate', mandatesByDelegator);
    expect(sortedCopy('asc')).toStrictEqual(result);
    result = sortDelegations('desc', 'endDate', mandatesByDelegator);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });

  it('sort delegation by name - delegators', () => {
    // sort ascending
    const sortedCopy = (order: 'asc' | 'desc') =>
      [...mandatesByDelegate].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        if (a.delegator?.displayName === b.delegator?.displayName) {
          return 0;
        }
        return (a.delegator?.displayName! < b.delegator?.displayName! ? -1 : 1) * multiplier;
      });
    let result = sortDelegations('asc', 'name', mandatesByDelegate);
    expect(sortedCopy('asc')).toStrictEqual(result);
    // sort descending
    result = sortDelegations('desc', 'name', mandatesByDelegate);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });

  it('sort delegation by endDate - delegators', () => {
    // sort ascending
    const sortedCopy = (order: 'asc' | 'desc') =>
      [...mandatesByDelegate].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        const dateA = new Date(a.dateto).getTime();
        const dateB = new Date(b.dateto).getTime();
        return (dateA - dateB) * multiplier;
      });
    let result = sortDelegations('asc', 'endDate', mandatesByDelegate);
    expect(sortedCopy('asc')).toStrictEqual(result);
    // sort descending
    result = sortDelegations('desc', 'endDate', mandatesByDelegate);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });
});
