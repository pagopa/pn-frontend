import { isBoolean } from '../IsBoolean';

describe('Test isBoolean utility function', () => {
  it('value not defined', () => {
    let result = isBoolean(null);
    expect(result).toBeFalsy();
    result = isBoolean(undefined);
    expect(result).toBeFalsy();
  });

  it('value not a boolean', () => {
    const result = isBoolean(2);
    expect(result).toBeFalsy();
  });

  it('value boolean', () => {
    const result = isBoolean(true);
    expect(result).toBeTruthy();
  });
});
