import { IsNumber } from '../IsNumber';

describe('Test IsNumber rule', () => {
  it('value not defined', () => {
    const rule = new IsNumber<any, Number | null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('positive - value in set - number', () => {
    const rule = new IsNumber<any, Number>();
    let result = rule.valueValidator(48);
    expect(result).toBe(null);
  });

  it('negative - value in set - string', () => {
    const rule = new IsNumber<any, String>();
    let result = rule.valueValidator('fake string');
    expect(result).toBe('Value must be of type number');
  });
});
