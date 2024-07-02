import { Required } from '../Required';

describe('Test required rule', () => {
  it('value is undefined', () => {
    const rule = new Required();
    const result = rule.valueValidator(undefined);
    expect(result).toBe('Value is required');
  });

  it('value is null', () => {
    const rule = new Required();
    const result = rule.valueValidator(null);
    expect(result).toBe('Value is required');
  });

  it('value is defined', () => {
    const rule = new Required();
    const result = rule.valueValidator(1);
    expect(result).toBe(null);
  });
});
