import { Length } from '../Length';

describe('Test length rule', () => {
  it('value not defined', () => {
    const rule = new Length<any, null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value not a string', () => {
    const rule = new Length<any, Number>();
    expect(() => rule.valueValidator(1)).toThrow('A non-string value was passed to the length rule');
  });

  it('valid value (without limits)', () => {
    const rule = new Length<any, String>();
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });

  it('valid value (with lower limit)', () => {
    const rule = new Length<any, String>(3);
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });

  it('invalid value (with lower limit)', () => {
    const rule = new Length<any, String>(6);
    const result = rule.valueValidator('prova');
    expect(result).toBe('Value mustn\'t have length less than 6');
  });

  it('valid value (with upper limit)', () => {
    const rule = new Length<any, String>(undefined, 6);
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });

  it('invalid value (with upper limit)', () => {
    const rule = new Length<any, String>(undefined, 4);
    const result = rule.valueValidator('prova');
    expect(result).toBe('Value mustn\'t have length greater than 4');
  });

  it('valid value (with both limits)', () => {
    const rule = new Length<any, String>(2, 6);
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });

  it('invalid value (with both limits)', () => {
    const rule = new Length<any, String>(2, 4);
    const result = rule.valueValidator('prova');
    expect(result).toBe('Value mustn\'t have length between 2 and 4');
  });
});
