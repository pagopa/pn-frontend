import { Matches } from '../Matches';

const regexp = new RegExp(/prova/gi);

describe('Test matches rule', () => {
  it('value is undefined', () => {
    const rule = new Matches<any, null | undefined>(regexp);
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value not a string', () => {
    const rule = new Matches<any, Number>(regexp);
    expect(() => rule.valueValidator(1)).toThrow('A non-string value was passed to the matches rule');
  });

  it('value matches regexp', () => {
    const rule = new Matches<any, String>(regexp);
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });

  it('value matches regexp (negative)', () => {
    const rule = new Matches<any, String>(regexp, true);
    const result = rule.valueValidator('prova');
    expect(result).toBe('Value matches the forbidden pattern');
  });

  it('value not matches regexp', () => {
    const rule = new Matches<any, String>(regexp);
    const result = rule.valueValidator('non supera il test');
    expect(result).toBe("Value doesn't match the required pattern");
  });

  it('value not matches regexp (negative)', () => {
    const rule = new Matches<any, String>(regexp, true);
    const result = rule.valueValidator('non supera il test');
    expect(result).toBe(null);
  });
});
