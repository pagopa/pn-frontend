import { vi } from 'vitest';

import { Between } from '../../rules/Between';
import { GreaterThan } from '../../rules/GreaterThan';
import { LessThan } from '../../rules/LessThan';
import { NumberRuleValidator } from '../NumberRuleValidator';

const pushRuleMk = vi.fn();
const dummyRuleValidator = new NumberRuleValidator(pushRuleMk);

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

vi.mock('../../rules/Between', () => {
  return {
    Between: vi.fn(),
  };
});

describe('Test NumberRuleValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.lessThan).toBeDefined();
    expect(dummyRuleValidator.greaterThan).toBeDefined();
    expect(dummyRuleValidator.between).toBeDefined();
  });

  it('check if lessThan rule is instantiated', () => {
    const result = dummyRuleValidator.lessThan(1);
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new LessThan(1));
    expect(result).toBeInstanceOf(NumberRuleValidator);
  });

  it('check if greaterThan rule is instantiated', () => {
    const result = dummyRuleValidator.greaterThan(1);
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new GreaterThan(1));
    expect(result).toBeInstanceOf(NumberRuleValidator);
  });

  it('check if between rule is instantiated', () => {
    const result = dummyRuleValidator.between(1, 2);
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new Between(1, 2));
    expect(result).toBeInstanceOf(NumberRuleValidator);
  });
});
