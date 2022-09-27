import { isDate } from '../IsDate';

describe('Test isDate utility function', () => {
  it('value not defined', () => {
    let result = isDate(null);
    expect(result).toBeFalsy();
    result = isDate(undefined);
    expect(result).toBeFalsy();
  });

  it('value not a date', () => {
    const result = isDate(1);
    expect(result).toBeFalsy();
  });

  it('value date', () => {
    const result = isDate(new Date());
    expect(result).toBeTruthy();
  });
});
