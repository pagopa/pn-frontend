import { isNumber } from '../IsNumber';

describe('Test isNumber utility function', () => {
  it('value not defined', () => {
    let result = isNumber(null);
    expect(result).toBeFalsy();
    result = isNumber(undefined);
    expect(result).toBeFalsy();
  });

  it('value not a number', () => {
    const result = isNumber('prova');
    expect(result).toBeFalsy();
  });

  it('value number', () => {
    const result = isNumber(4);
    expect(result).toBeTruthy();
  });
});
