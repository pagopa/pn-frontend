import { CustomValidator } from '../CustomValidator';

const rule = new CustomValidator<any, String>((value) => {
  if (value === 'ok') {
    return 'Custom validator message';
  }
  return null;
});

describe('Test custom validator rule', () => {
  it('value not pass custom validation', () => {
    const result = rule.valueValidator('ok', null);
    expect(result).toBe('Custom validator message');
  });

  it('value pass custom validation', () => {
    const result = rule.valueValidator('nothing', null);
    expect(result).toBe(null);
  });
});
