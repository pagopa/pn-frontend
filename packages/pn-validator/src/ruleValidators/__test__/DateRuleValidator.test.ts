import { vi } from 'vitest';

import { GreaterThan } from '../../rules/GreaterThan';
import { LessThan } from '../../rules/LessThan';
import { Required } from '../../rules/Required';
import { DateRuleValidator } from '../DateRuleValidator';

const pushRuleMk = vi.fn();
const dummyRuleValidator = new DateRuleValidator(pushRuleMk);

vi.mock('../../rules/LessThan', () => {
  return {
    LessThan: vi.fn(),
  };
});

vi.mock('../../rules/GreaterThan', () => {
  return {
    GreaterThan: vi.fn(),
  };
});

vi.mock('../../rules/Required', () => {
  return {
    Required: vi.fn(),
  };
});

describe('Test DateRuleValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.lessThan).toBeDefined();
    expect(dummyRuleValidator.greaterThan).toBeDefined();
    expect(dummyRuleValidator.required).toBeDefined();
  });

  it('check if lessThan rule is instantiated', () => {
    const result = dummyRuleValidator.lessThan(new Date());
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new LessThan(new Date()));
    expect(result).toBeInstanceOf(DateRuleValidator);
  });

  it('check if greaterThan rule is instantiated', () => {
    const result = dummyRuleValidator.greaterThan(new Date());
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new GreaterThan(new Date()));
    expect(result).toBeInstanceOf(DateRuleValidator);
  });

  it('check if required rule is instantiated', () => {
    const result = dummyRuleValidator.required();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new Required());
    expect(result).toBeInstanceOf(DateRuleValidator);
  });
});
