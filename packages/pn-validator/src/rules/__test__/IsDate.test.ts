import { IsDate } from '../IsDate';

describe('Test IsDate rule', () => {
  it('value not defined', () => {
    const rule = new IsDate<any, Date | null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('positive - value in set - date', () => {
    const rule = new IsDate<any, Date>();
    let result = rule.valueValidator(new Date());
    expect(result).toBe(null);
  });

  it('negative - value in set - string', () => {
    const rule = new IsDate<any, String>();
    let result = rule.valueValidator('fake string');
    expect(result).toBe('Value must be of type date');
  });
});
