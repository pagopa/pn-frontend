import { IsEqual } from './../IsEqual';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

describe('Test equal rule', () => {
  it('value not defined', () => {
    let rule = new IsEqual<any, null | undefined>(null);
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    rule = new IsEqual<any, null | undefined>(undefined);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value is equal (string)', () => {
    const rule = new IsEqual<any, String>('prova');
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });

  it('value is not equal (string)', () => {
    const rule = new IsEqual<any, String>('prova');
    const result = rule.valueValidator('');
    expect(result).toBe('Value must be equal to prova');
  });

  it('value is equal (string - negated)', () => {
    const rule = new IsEqual<any, String>('prova', true);
    const result = rule.valueValidator('prova');
    expect(result).toBe("Value mustn't be equal to prova");
  });

  it('value is not equal (string - negated)', () => {
    const rule = new IsEqual<any, String>('prova', true);
    const result = rule.valueValidator('');
    expect(result).toBe(null);
  });

  it('value is equal (number)', () => {
    const rule = new IsEqual<any, Number>(1);
    const result = rule.valueValidator(1);
    expect(result).toBe(null);
  });

  it('value is not equal (number)', () => {
    const rule = new IsEqual<any, Number>(1);
    const result = rule.valueValidator(0);
    expect(result).toBe('Value must be equal to 1');
  });

  it('value is equal (number - negated)', () => {
    const rule = new IsEqual<any, Number>(1, true);
    const result = rule.valueValidator(1);
    expect(result).toBe("Value mustn't be equal to 1");
  });

  it('value is not equal (number - negated)', () => {
    const rule = new IsEqual<any, Number>(1, true);
    const result = rule.valueValidator(0);
    expect(result).toBe(null);
  });
  
  it('value is equal (date)', () => {
    const rule = new IsEqual<any, Date>(today);
    const result = rule.valueValidator(today);
    expect(result).toBe(null);
  });

  it('value is not equal (date)', () => {
    const rule = new IsEqual<any, Date>(today);
    const result = rule.valueValidator(tomorrow);
    expect(result).toBe(`Value must be equal to ${today.toISOString()}`);
  });

  it('value is equal (date - negated)', () => {
    const rule = new IsEqual<any, Date>(today, true);
    const result = rule.valueValidator(today);
    expect(result).toBe(`Value mustn't be equal to ${today.toISOString()}`);
  });

  it('value is not equal (date - negated)', () => {
    const rule = new IsEqual<any, Date>(today, true);
    const result = rule.valueValidator(tomorrow);
    expect(result).toBe(null);
  });

  it('value is equal (array)', () => {
    const rule = new IsEqual<any, String[]>(['prova1', 'prova2']);
    const result = rule.valueValidator(['prova1', 'prova2']);
    expect(result).toBe(null);
  });

  it('value is not equal (array)', () => {
    const rule = new IsEqual<any, String[]>(['prova1', 'prova2']);
    const result = rule.valueValidator(['prova']);
    expect(result).toBe(`Value must be equal to ${JSON.stringify(['prova1', 'prova2'])}`);
  });

  it('value is equal (array - negated)', () => {
    const rule = new IsEqual<any, String[]>(['prova1', 'prova2'], true);
    const result = rule.valueValidator(['prova1', 'prova2']);
    expect(result).toBe(`Value mustn't be equal to ${JSON.stringify(['prova1', 'prova2'])}`);
  });

  it('value is not equal (array - negated)', () => {
    const rule = new IsEqual<any, String[]>(['prova1', 'prova2'], true);
    const result = rule.valueValidator(['prova']);
    expect(result).toBe(null);
  });

  it('value is equal (object)', () => {
    const rule = new IsEqual<any, { property: string }>({ property: 'prova' });
    const result = rule.valueValidator({ property: 'prova' });
    expect(result).toBe(null);
  });

  it('value is not equal (object)', () => {
    const rule = new IsEqual<any, { property: string }>({ property: 'prova' });
    const result = rule.valueValidator({ property: 'prova1' });
    expect(result).toBe(`Value must be equal to ${JSON.stringify({ property: 'prova' })}`);
  });

  it('value is equal (object - negated)', () => {
    const rule = new IsEqual<any, { property: string }>({ property: 'prova' }, true);
    const result = rule.valueValidator({ property: 'prova' });
    expect(result).toBe(`Value mustn't be equal to ${JSON.stringify({ property: 'prova' })}`);
  });

  it('value is not equal (object - negated)', () => {
    const rule = new IsEqual<any, { property: string }>({ property: 'prova' }, true);
    const result = rule.valueValidator({ property: 'prova1' });
    expect(result).toBe(null);
  });
});
