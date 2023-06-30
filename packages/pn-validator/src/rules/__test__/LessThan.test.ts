import { LessThan } from './../LessThan';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

describe('Test less than rule', () => {
  it('value not defined', () => {
    const rule = new LessThan<any, null | undefined>(5);
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value not a number', () => {
    const rule = new LessThan<any, String>(5);
    expect(() => rule.valueValidator('prova')).toThrow('A value with wrong type was passed to the lessThan rule');
  });

  it('value less than (number - not equal)', () => {
    const rule = new LessThan<any, Number>(5);
    const result = rule.valueValidator(4);
    expect(result).toBe(null);
  });

  it('value not less than (number - not equal)', () => {
    const rule = new LessThan<any, Number>(5);
    const result = rule.valueValidator(5);
    expect(result).toBe('Value must be less than 5');
  });

  it('value less than (number - equal)', () => {
    const rule = new LessThan<any, Number>(5, true);
    const result = rule.valueValidator(4);
    expect(result).toBe(null);
  });

  it('value not less than (number - equal)', () => {
    const rule = new LessThan<any, Number>(5, true);
    const result = rule.valueValidator(7);
    expect(result).toBe('Value must be less than or equal to 5');
  });

  it('value less than (date - not equal)', () => {
    const rule = new LessThan<any, Date>(today);
    const result = rule.valueValidator(yesterday);
    expect(result).toBe(null);
  });

  it('value not less than (date - not equal)', () => {
    const rule = new LessThan<any, Date>(today);
    const result = rule.valueValidator(tomorrow);
    expect(result).toBe(`Value must be less than ${today.toISOString()}`);
  });

  it('value less than (date - equal)', () => {
    const rule = new LessThan<any, Date>(today, true);
    const result = rule.valueValidator(today);
    expect(result).toBe(null);
  });

  it('value not less than (date - equal)', () => {
    const rule = new LessThan<any, Date>(today, true);
    const result = rule.valueValidator(tomorrow);
    expect(result).toBe(`Value must be less than or equal to ${today.toISOString()}`);
  });
});
