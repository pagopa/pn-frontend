import { IsEmpty } from './../IsEmpty';

describe('Test empty rule', () => {
  it('value not defined', () => {
    const rule = new IsEmpty<any, null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('value is empty (string)', () => {
    const rule = new IsEmpty<any, String>();
    const result = rule.valueValidator('');
    expect(result).toBe(null);
  });

  it('value is not empty (string)', () => {
    const rule = new IsEmpty<any, String>();
    const result = rule.valueValidator('prova');
    expect(result).toBe('Value must be empty');
  });

  it('value is empty (string - negated)', () => {
    const rule = new IsEmpty<any, String>(true);
    const result = rule.valueValidator('');
    expect(result).toBe('Value mustn\'t be empty');
  });

  it('value is not empty (string - negated)', () => {
    const rule = new IsEmpty<any, String>(true);
    const result = rule.valueValidator('prova');
    expect(result).toBe(null);
  });

  it('value is empty (array)', () => {
    const rule = new IsEmpty<any, String[]>();
    const result = rule.valueValidator([]);
    expect(result).toBe(null);
  });

  it('value is not empty (array)', () => {
    const rule = new IsEmpty<any, String[]>();
    const result = rule.valueValidator(['prova']);
    expect(result).toBe('Value must be empty');
  });

  it('value is empty (array - negated)', () => {
    const rule = new IsEmpty<any, String[]>(true);
    const result = rule.valueValidator([]);
    expect(result).toBe('Value mustn\'t be empty');
  });

  it('value is not empty (array - negated)', () => {
    const rule = new IsEmpty<any, String[]>(true);
    const result = rule.valueValidator(['prova']);
    expect(result).toBe(null);
  });

  it('value is empty (object)', () => {
    const rule = new IsEmpty<any, {property: string} | {}>();
    const result = rule.valueValidator({});
    expect(result).toBe(null);
  });

  it('value is not empty (object)', () => {
    const rule = new IsEmpty<any, {property: string}>();
    const result = rule.valueValidator({property: 'prova'});
    expect(result).toBe('Value must be empty');
  });

  it('value is empty (object - negated)', () => {
    const rule = new IsEmpty<any, {property: string} | {}>(true);
    const result = rule.valueValidator({});
    expect(result).toBe('Value mustn\'t be empty');
  });

  it('value is not empty (object - negated)', () => {
    const rule = new IsEmpty<any, {property: string}>(true);
    const result = rule.valueValidator({property: 'prova'});
    expect(result).toBe(null);
  });
});
