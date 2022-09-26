import { Rule } from '../Rule';

class DummyRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (value === 'ko') {
      return 'Dummy error';
    }
    return null;
  };
}

describe('Test Rule class', () => {
  it('check if methods exist', () => {
    const dummyRule = new DummyRule();
    expect(dummyRule.validate).toBeDefined();
  });

  it('check validate method (value valid)', () => {
    const dummyRule = new DummyRule();
    const result = dummyRule.validate('ok', {});
    expect(result).toBeNull();
  });

  it('check validate method (value invalid)', () => {
    const dummyRule = new DummyRule();
    const result = dummyRule.validate('ko', {});
    expect(result).toBe('Dummy error');
  });

  it('check validate method (value invalid and custom error message)', () => {
    const dummyRule = new DummyRule('Custom dummy error message');
    const result = dummyRule.validate('ko', {});
    expect(result).toBe('Custom dummy error message');
  });
});
