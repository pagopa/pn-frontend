import { GreaterThan } from './../GreaterThan';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

describe('Test greater than rule', () => {
  it('value not defined', () => {
    const rule = new GreaterThan<any, null | undefined>(5);
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value not a number', () => {
    const rule = new GreaterThan<any, String>(5);
    expect(() => rule.valueValidator('prova')).toThrow('A value with wrong type was passed to the greaterThan rule');
  });

  it('value greater than (number - not equal)', () => {
    const rule = new GreaterThan<any, Number>(5);
    const result = rule.valueValidator(6);
    expect(result).toBe(null);
  });

  it('value not greater than (number - not equal)', () => {
    const rule = new GreaterThan<any, Number>(5);
    const result = rule.valueValidator(5);
    expect(result).toBe('Value must be greater than 5');
  });

  it('value greater than (number - equal)', () => {
    const rule = new GreaterThan<any, Number>(5, true);
    const result = rule.valueValidator(6);
    expect(result).toBe(null);
  });

  it('value not greater than (number - equal)', () => {
    const rule = new GreaterThan<any, Number>(5, true);
    const result = rule.valueValidator(4);
    expect(result).toBe('Value must be greater than or equal to 5');
  });

  it('value greater than (date - not equal)', () => {
    const rule = new GreaterThan<any, Date>(today);
    const result = rule.valueValidator(tomorrow);
    expect(result).toBe(null);
  });

  it('value not greater than (date - not equal)', () => {
    const rule = new GreaterThan<any, Date>(today);
    const result = rule.valueValidator(yesterday);
    expect(result).toBe(`Value must be greater than ${today.toISOString()}`);
  });

  it('value greater than (date - equal)', () => {
    const rule = new GreaterThan<any, Date>(today, true);
    const result = rule.valueValidator(today);
    expect(result).toBe(null);
  });

  it('value not greater than (date - equal)', () => {
    const rule = new GreaterThan<any, Date>(today, true);
    const result = rule.valueValidator(yesterday);
    expect(result).toBe(`Value must be greater than or equal to ${today.toISOString()}`);
  });
});
