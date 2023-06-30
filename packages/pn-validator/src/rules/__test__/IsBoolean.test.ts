import { IsBoolean } from './../IsBoolean';

describe('Test IsBoolean rule', () => {
  it('value not defined', () => {
    const rule = new IsBoolean<any, Boolean | null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('positive - value in set - boolean', () => {
    const rule = new IsBoolean<any, Boolean>();
    let result = rule.valueValidator(true);
    expect(result).toBe(null);
  });

  it('negative - value in set - string', () => {
    const rule = new IsBoolean<any, String>();
    let result = rule.valueValidator('fake string');
    expect(result).toBe('Value must be of type boolean');
  });
});
