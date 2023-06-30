import { IsString } from '../IsString';

describe('Test IsString rule', () => {
  it('value not defined', () => {
    const rule = new IsString<any, String | null | undefined>();
    let result = rule.valueValidator(null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined);
    expect(result).toBe(null);
  });

  it('positive - value in set - string', () => {
    const rule = new IsString<any, String>();
    let result = rule.valueValidator("alfa");
    expect(result).toBe(null);
  });

  it('negative - value in set - number', () => {
    const rule = new IsString<any, number>();
    let result = rule.valueValidator(48);
    expect(result).toBe('Value must be of type string');
  });
});
