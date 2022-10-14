import { IsUndefined } from '../IsUndefined';

describe('Test is undefined rule', () => {
  it('value is undefined', () => {
    const rule = new IsUndefined<any, undefined>();
    const result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value not undefined', () => {
    const rule = new IsUndefined<any, String>();
    const result = rule.valueValidator('prova');
    expect(result).toBe('Value must be undefined');
  });

  it('value is undefined (negated)', () => {
    const rule = new IsUndefined<any, undefined>(true);
    const result = rule.valueValidator(undefined);
    expect(result).toBe('Value mustn\'t be undefined');
  });

  it('value not undefined (negated)', () => {
    const rule = new IsUndefined<any, String>(true);
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });
});
