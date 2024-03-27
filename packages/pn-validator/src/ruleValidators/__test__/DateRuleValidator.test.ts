import { GreaterThan } from '../../rules/GreaterThan';
import { LessThan } from '../../rules/LessThan';
import { DateRuleValidator } from '../DateRuleValidator';

const pushRuleMk = jest.fn();
const dummyRuleValidator = new DateRuleValidator(pushRuleMk);

jest.mock('../../rules/LessThan', () => {
    return {
        LessThan: jest.fn()
    }
});

jest.mock('../../rules/GreaterThan', () => {
    return {
        GreaterThan: jest.fn()
    }
});

describe('Test DateRuleValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.lessThan).toBeDefined();
    expect(dummyRuleValidator.greaterThan).toBeDefined();
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
});
