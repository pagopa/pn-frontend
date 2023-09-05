import crypto from 'crypto';

import { formatDate } from '@pagopa-pn/pn-commons';

import { arrayOfDelegates, arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import delegationToItem, { generateVCode, sortDelegations } from '../delegation.utility';

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: () => crypto.randomInt(2 ** 32),
  },
});

describe('Delegation utility test', () => {
  it('Should convert an delegation array of delegate to an item array - delegate', () => {
    const item = delegationToItem(arrayOfDelegates);
    const expected = arrayOfDelegates.map((delegation) => ({
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
    const item = delegationToItem(arrayOfDelegators);
    const expected = arrayOfDelegators.map((delegation) => ({
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
      [...arrayOfDelegates].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        if (a.delegate?.displayName === b.delegate?.displayName) {
          return 0;
        }
        return (a.delegate?.displayName! < b.delegate?.displayName! ? -1 : 1) * multiplier;
      });
    let result = sortDelegations('asc', 'displayName', arrayOfDelegates);
    expect(sortedCopy('asc')).toStrictEqual(result);
    // sort descending
    result = sortDelegations('desc', 'displayName', arrayOfDelegates);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });

  it('sort delegation by endDate - delegates', () => {
    const sortedCopy = (order: 'asc' | 'desc') =>
      [...arrayOfDelegates].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        const dateA = new Date(a.dateto).getTime();
        const dateB = new Date(b.dateto).getTime();
        return (dateA - dateB) * multiplier;
      });
    let result = sortDelegations('asc', 'endDate', arrayOfDelegates);
    expect(sortedCopy('asc')).toStrictEqual(result);
    result = sortDelegations('desc', 'endDate', arrayOfDelegates);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });

  it('sort delegation by name - delegators', () => {
    // sort ascending
    const sortedCopy = (order: 'asc' | 'desc') =>
      [...arrayOfDelegators].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        if (a.delegator?.displayName === b.delegator?.displayName) {
          return 0;
        }
        return (a.delegator?.displayName! < b.delegator?.displayName! ? -1 : 1) * multiplier;
      });
    let result = sortDelegations('asc', 'displayName', arrayOfDelegators);
    expect(sortedCopy('asc')).toStrictEqual(result);
    // sort descending
    result = sortDelegations('desc', 'displayName', arrayOfDelegators);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });

  it('sort delegation by endDate - delegators', () => {
    const sortedCopy = (order: 'asc' | 'desc') =>
      [...arrayOfDelegators].sort((a, b) => {
        const multiplier = order === 'asc' ? 1 : -1;
        const dateA = new Date(a.dateto).getTime();
        const dateB = new Date(b.dateto).getTime();
        return (dateA - dateB) * multiplier;
      });
    let result = sortDelegations('asc', 'endDate', arrayOfDelegators);
    expect(sortedCopy('asc')).toStrictEqual(result);
    result = sortDelegations('desc', 'endDate', arrayOfDelegators);
    expect(sortedCopy('desc')).toStrictEqual(result);
  });
});
