import { vi } from 'vitest';

import { CustomValidator } from '../../rules/CustomValidator';
import { IsNull } from '../../rules/IsNull';
import { IsOneOf } from '../../rules/IsOneOf';
import { IsUndefined } from '../../rules/IsUndefined';
import { Required } from '../../rules/Required';
import { CommonRuleValidator } from '../CommonRuleValidator';
import { IsEqual } from './../../rules/IsEqual';

class DummyRuleValidator<TModel, TValue> extends CommonRuleValidator<TModel, TValue> {}

const pushRuleMk = vi.fn();
const dummyRuleValidator = new DummyRuleValidator(pushRuleMk);

vi.mock('../../rules/IsNull', () => {
  return {
    IsNull: vi.fn(),
  };
});

vi.mock('../../rules/IsUndefined', () => {
  return {
    IsUndefined: vi.fn(),
  };
});

vi.mock('../../rules/IsEqual', () => {
  return {
    IsEqual: vi.fn(),
  };
});

vi.mock('../../rules/CustomValidator', () => {
  return {
    CustomValidator: vi.fn(),
  };
});

vi.mock('../../rules/IsOneOf', () => {
  return {
    IsOneOf: vi.fn(),
  };
});

vi.mock('../../rules/Required', () => {
  return {
    Required: vi.fn(),
  };
});

describe('Test CommonRuleValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.isNull).toBeDefined();
    expect(dummyRuleValidator.isUndefined).toBeDefined();
    expect(dummyRuleValidator.isEqual).toBeDefined();
    expect(dummyRuleValidator.customValidator).toBeDefined();
    expect(dummyRuleValidator.isRequired).toBeDefined();
  });

  it('check if isNull rule is instantiated', () => {
    const result = dummyRuleValidator.isNull();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new IsNull());
    expect(result).toBeInstanceOf(DummyRuleValidator);
  });

  it('check if isUndefined rule is instantiated', () => {
    const result = dummyRuleValidator.isUndefined();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new IsUndefined());
    expect(result).toBeInstanceOf(DummyRuleValidator);
  });

  it('check if isEqual rule is instantiated', () => {
    const result = dummyRuleValidator.isEqual('prova');
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new IsEqual('prova'));
    expect(result).toBeInstanceOf(DummyRuleValidator);
  });

  it('check if isOneOf rule is instantiated', () => {
    const possibleValues = ['prova1', 'prova2'];
    const result = dummyRuleValidator.isOneOf(possibleValues);
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new IsOneOf(possibleValues));
    expect(result).toBeInstanceOf(DummyRuleValidator);
  });

  it('check if customValidator rule is instantiated', () => {
    const result = dummyRuleValidator.customValidator(() => null);
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new CustomValidator(() => null));
    expect(result).toBeInstanceOf(DummyRuleValidator);
  });

  it('check if required rule is instantiated', () => {
    const result = dummyRuleValidator.isRequired();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new Required());
    expect(result).toBeInstanceOf(DummyRuleValidator);
  });
});
