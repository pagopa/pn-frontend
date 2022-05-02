import crypto from 'crypto';
import delegationToItem, { generateVCode } from '../delegation.utility';
import { delegationArray, testItem } from './testObjects';

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
