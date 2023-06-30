import { IsArray } from '../IsArray';

describe('Test IsArray rule', () => {
  it('value not defined', () => {
    const rule = new IsArray<any, Array<unknown> | null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('positive - value in set - array', () => {
    const rule = new IsArray<any, Array<unknown>>();
    let result = rule.valueValidator([]);
    expect(result).toBe(null);
  });

  it('negative - value in set - string', () => {
    const rule = new IsArray<any, String>();
    let result = rule.valueValidator('fake string');
    expect(result).toBe('Value must be of type array');
  });
});
