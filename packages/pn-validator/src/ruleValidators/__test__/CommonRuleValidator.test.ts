import { IsEqual } from './../../rules/IsEqual';
import { IsNull } from '../../rules/IsNull';
import { IsUndefined } from '../../rules/IsUndefined';
import { IsOneOf } from '../../rules/IsOneOf';
import { CustomValidator } from '../../rules/CustomValidator';
import { CommonRuleValidator } from '../CommonRuleValidator';

class DummyRuleValidator<TModel, TValue> extends CommonRuleValidator<TModel, TValue> {}

const pushRuleMk = jest.fn();
const dummyRuleValidator = new DummyRuleValidator(pushRuleMk);

jest.mock('../../rules/IsNull', () => {
    return {
        IsNull: jest.fn()
    }
});

jest.mock('../../rules/IsUndefined', () => {
    return {
        IsUndefined: jest.fn()
    }
});

jest.mock('../../rules/IsEqual', () => {
    return {
        IsEqual: jest.fn()
    }
});

jest.mock('../../rules/CustomValidator', () => {
    return {
        CustomValidator: jest.fn()
    }
});

jest.mock('../../rules/IsOneOf', () => {
  return {
      IsOneOf: jest.fn()
  }
});

describe('Test CommonRuleValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.isNull).toBeDefined();
    expect(dummyRuleValidator.isUndefined).toBeDefined();
    expect(dummyRuleValidator.isEqual).toBeDefined();
    expect(dummyRuleValidator.customValidator).toBeDefined();
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
});
