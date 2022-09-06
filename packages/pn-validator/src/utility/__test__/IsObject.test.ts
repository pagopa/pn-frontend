import { isObject } from '../IsObject';

describe('Test isObject utility function', () => {
  it('value not defined', () => {
    let result = isObject(null);
    expect(result).toBeFalsy();
    result = isObject(undefined);
    expect(result).toBeFalsy();
  });

  it('value not an object', () => {
    const result = isObject([]);
    expect(result).toBeFalsy();
  });

  it('value object', () => {
    const result = isObject({a: 'a', b: 'b', c: 'c'});
    expect(result).toBeTruthy();
  });
});
