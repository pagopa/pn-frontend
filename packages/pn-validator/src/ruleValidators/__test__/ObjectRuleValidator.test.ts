import { Validator } from '../../Validator';
import { IsEmpty } from '../../rules/IsEmpty';
import { InnerValidator } from '../../rules/InnerValidator';
import { ObjectRuleValidator } from '../ObjectRuleValidator';

class DummyValidator extends Validator<any> {}

const pushRuleMk = jest.fn();
const dummyRuleValidator = new ObjectRuleValidator(pushRuleMk);

jest.mock('../../rules/IsEmpty', () => {
  return {
    IsEmpty: jest.fn(),
  };
});

jest.mock('../../rules/InnerValidator', () => {
  return {
    InnerValidator: jest.fn(),
  };
});

describe('Test ObjectRuleValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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
