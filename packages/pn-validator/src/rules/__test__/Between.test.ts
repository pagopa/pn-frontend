import { Between } from '../Between';

describe('Test between rule', () => {
  it('value not defined', () => {
    const rule = new Between<any, null | undefined>(1, 5);
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value not a number', () => {
    const rule = new Between<any, String>(1, 5);
    expect(() => rule.valueValidator('prova')).toThrow('A non-number value was passed to the betwen rule');
  });

  it('value in the range (no inclusive)', () => {
    const rule = new Between<any, Number>(1, 5);
    const result = rule.valueValidator(2);
    expect(result).toBe(null);
  });

  it('value not in the range (no inclusive)', () => {
    const rule = new Between<any, Number>(1, 5);
    const result = rule.valueValidator(6);
    expect(result).toBe('Value must be between 1 and 5 (exclusive)');
  });

  it('value in the range (inclusive lower bound)', () => {
    const rule = new Between<any, Number>(1, 5, true);
    const result = rule.valueValidator(1);
    expect(result).toBe(null);
  });

  it('value not in the range (inclusive lower bound)', () => {
    const rule = new Between<any, Number>(1, 5, true);
    const result = rule.valueValidator(6);
    expect(result).toBe('Value must be between 1 and 5 (inclusive lower bound)');
  });

  it('value in the range (inclusive upper bound)', () => {
    const rule = new Between<any, Number>(1, 5, false, true);
    const result = rule.valueValidator(5);
    expect(result).toBe(null);
  });

  it('value not in the range (inclusive upper bound)', () => {
    const rule = new Between<any, Number>(1, 5, false, true);
    const result = rule.valueValidator(6);
    expect(result).toBe('Value must be between 1 and 5 (inclusive upper bound)');
  });

  it('value in the range (inclusive)', () => {
    const rule = new Between<any, Number>(1, 5, true, true);
    const result = rule.valueValidator(5);
    expect(result).toBe(null);
  });

  it('value not in the range (inclusive)', () => {
    const rule = new Between<any, Number>(1, 5, true, true);
    const result = rule.valueValidator(6);
    expect(result).toBe('Value must be between 1 and 5 (inclusive)');
  });
});
