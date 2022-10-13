import { isArray } from '../IsArray';

describe('Test isArray utility function', () => {
  it('value not defined', () => {
    let result = isArray(null);
    expect(result).toBeFalsy();
    result = isArray(undefined);
    expect(result).toBeFalsy();
  });

  it('value not array', () => {
    const result = isArray({});
    expect(result).toBeFalsy();
  });

  it('value array', () => {
    const result = isArray([1, 2, 3]);
    expect(result).toBeTruthy();
  });
});
