import crypto from 'crypto';
import delegationToItem, { generateVCode } from '../delegation.utility';
import { delegationArray, testItem } from './testObjects';
import {
  compareDelegationsStrings,
  sortDelegations
} from "@pagopa-pn/pn-personafisica-webapp/src/utils/delegation.utility";
import {
  arrayOfDelegates,
  arrayOfDelegators
} from "../../../../pn-personafisica-webapp/src/redux/delegation/__test__/test.utils";

test('Should convert an delegation array of delegate to an item array', () => {
  const item = delegationToItem(delegationArray);
  expect(item).toStrictEqual(testItem);
});

// eslint-disable-next-line functional/immutable-data
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: () => crypto.randomInt(2 ** 32),
  },
});

describe('Generate Verification Code', () => {
  const verificationCode = generateVCode();
  it('Should be a numerical string', () => {
    expect(Number(verificationCode)).not.toBeNaN();
  });
  it('Should have a length of 5 digits', () => {
    expect(verificationCode.length).toBe(5);
  });
});

describe('compareDelegationStrings function', () => {
  describe('delegators case', () => {
    it('returns 1 if the name is ordered alphabetically', () => {
      const result = compareDelegationsStrings(arrayOfDelegators[1], arrayOfDelegators[0], 'displayName')
      expect(result).toEqual(1)
    });

    it('returns -1 if the name is not ordered alphabetically', () => {
      const result = compareDelegationsStrings(arrayOfDelegators[0], arrayOfDelegators[1], 'displayName')
      expect(result).toEqual(-1)
    });

    it('returns -1 if the name is the same', () => {
      const result = compareDelegationsStrings(arrayOfDelegators[0], arrayOfDelegators[0], 'displayName')
      expect(result).toEqual(-1)
    });
  })

  describe('delegates case', () => {
    it('returns 1 if the name is ordered alphabetically', () => {
      const result = compareDelegationsStrings(arrayOfDelegates[1], arrayOfDelegates[0], 'displayName')
      expect(result).toEqual(1)
    });

    it('returns -1 if the name is not ordered alphabetically', () => {
      const result = compareDelegationsStrings(arrayOfDelegates[0], arrayOfDelegates[1], 'displayName')
      expect(result).toEqual(-1)
    });

    it('returns -1 if the name is the same', () => {
      const result = compareDelegationsStrings(arrayOfDelegates[0], arrayOfDelegates[0], 'displayName')
      expect(result).toEqual(-1)
    });
  });
});

describe('sortDelegations function', () => {
  it('ascendant by name', () => {
    // make a copy of the array because the original one
    const originalCopy = [...arrayOfDelegates];
    const result = sortDelegations('asc', 'displayName', arrayOfDelegates);
    expect(originalCopy[0]).toEqual(result[1]);
    expect(originalCopy[0]).toEqual(result[1]);
  });

  it('descendant by name', () => {
    const originalCopy = [...arrayOfDelegates];
    const result = sortDelegations('desc', 'displayName', arrayOfDelegates);
    expect(originalCopy[0]).toEqual(result[1]);
    expect(originalCopy[1]).toEqual(result[0]);
  });

  it('descendant by endDate', () => {
    const originalCopy = [...arrayOfDelegates];
    const result = sortDelegations('asc', 'endDate', arrayOfDelegates);
    expect(originalCopy[0]).toEqual(result[1]);
    expect(originalCopy[1]).toEqual(result[0]);
  });
});