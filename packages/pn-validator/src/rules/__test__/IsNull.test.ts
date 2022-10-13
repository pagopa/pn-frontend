import { IsNull } from '../IsNull';

describe('Test is null rule', () => {
  it('value is null', () => {
    const rule = new IsNull<any, null>();
    const result = rule.valueValidator(null);
    expect(result).toBe(null);
  });

  it('value not null', () => {
    const rule = new IsNull<any, String>();
    const result = rule.valueValidator('prova');
    expect(result).toBe('Value must be null');
  });

  it('value is null (negated)', () => {
    const rule = new IsNull<any, null>(true);
    const result = rule.valueValidator(null);
    expect(result).toBe('Value mustn\'t be null');
  });

  it('value not null (negated)', () => {
    const rule = new IsNull<any, String>(true);
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });
});
