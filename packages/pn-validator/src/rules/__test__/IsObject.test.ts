import { IsObject } from './../IsObject';

describe('Test IsObject rule', () => {
  it('value not defined', () => {
    const rule = new IsObject<any, object | null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('positive - value in set - object', () => {
    const rule = new IsObject<any, object>();
    let result = rule.valueValidator({});
    expect(result).toBe(null);
  });

  it('negative - value in set - string', () => {
    const rule = new IsObject<any, String>();
    let result = rule.valueValidator('fake string');
    expect(result).toBe('Value must be of type object');
  });
});
