import { vi } from 'vitest';

import { Validator } from '../../Validator';
import { InnerValidator } from '../../rules/InnerValidator';
import { IsEmpty } from '../../rules/IsEmpty';
import { ObjectRuleValidator } from '../ObjectRuleValidator';

class DummyValidator extends Validator<any> {}

const pushRuleMk = vi.fn();
const dummyRuleValidator = new ObjectRuleValidator(pushRuleMk);

vi.mock('../../rules/IsEmpty', () => {
  return {
    IsEmpty: vi.fn(),
  };
});

vi.mock('../../rules/InnerValidator', () => {
  return {
    InnerValidator: vi.fn(),
  };
});

describe('Test ObjectRuleValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.isEmpty).toBeDefined();
    expect(dummyRuleValidator.setValidator).toBeDefined();
  });

  it('check if isEmpty rule is instantiated', () => {
    const result = dummyRuleValidator.isEmpty();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new IsEmpty());
    expect(result).toBeInstanceOf(ObjectRuleValidator);
  });

  it('check if setValidator rule is instantiated', () => {
    const result = dummyRuleValidator.setValidator(new DummyValidator());
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new InnerValidator(new DummyValidator()));
    expect(result).toBeInstanceOf(ObjectRuleValidator);
  });
});
