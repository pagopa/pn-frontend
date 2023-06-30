import { IsOneOf } from '../IsOneOf';

describe('Test IsOneOf rule', () => {
  it('value not defined', () => {
    const rule = new IsOneOf<any, String | null | undefined>([]);
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('positive - value in set - string', () => {
    const rule = new IsOneOf<any, String>(["alfa", "beta"]);
    let result = rule.valueValidator("alfa");
    expect(result).toBe(null);
  });

  it('positive - value in set - number', () => {
    const rule = new IsOneOf<any, number>([48, 23]);
    let result = rule.valueValidator(48);
    expect(result).toBe(null);
  });

  it('positive - value not in set - string', () => {
    const rule = new IsOneOf<any, String>(["alfa", "beta"]);
    let result = rule.valueValidator("aleph");
    expect(result).toBe('Value is not included in the expected set');
  });

  it('positive - value in set - number', () => {
    const rule = new IsOneOf<any, number>([48, 23]);
    let result = rule.valueValidator(42);
    expect(result).toBe('Value is not included in the expected set');
  });

  it('negative - value in set - string', () => {
    const rule = new IsOneOf<any, String>(["alfa", "beta"], true);
    let result = rule.valueValidator("alfa");
    expect(result).toBe('Value is included in the forbidden set');
  });

  it('negative - value in set - number', () => {
    const rule = new IsOneOf<any, number>([48, 23], true);
    let result = rule.valueValidator(48);
    expect(result).toBe('Value is included in the forbidden set');
  });

  it('negative - value not in set - string', () => {
    const rule = new IsOneOf<any, String>(["alfa", "beta"], true);
    let result = rule.valueValidator("aleph");
    expect(result).toBe(null);
  });

  it('negative - value in set - number', () => {
    const rule = new IsOneOf<any, number>([48, 23], true);
    let result = rule.valueValidator(42);
    expect(result).toBe(null);
  });
});
