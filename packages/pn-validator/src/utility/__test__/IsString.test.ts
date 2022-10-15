import { isString } from '../IsString';

describe('Test isString utility function', () => {
  it('value not defined', () => {
    let result = isString(null);
    expect(result).toBeFalsy();
    result = isString(undefined);
    expect(result).toBeFalsy();
  });

  it('value not a string', () => {
    const result = isString(2);
    expect(result).toBeFalsy();
  });

  it('value string', () => {
    const result = isString('prova');
    expect(result).toBeTruthy();
  });
});
