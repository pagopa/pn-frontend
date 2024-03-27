import { ForEachElement } from '../../rules/ForEachElement';
import { IsEmpty } from '../../rules/IsEmpty';
import { ArrayRuleValidator } from '../ArrayRuleValidator';

const pushRuleMk = jest.fn();
const dummyRuleValidator = new ArrayRuleValidator(pushRuleMk);

jest.mock('../../rules/IsEmpty', () => {
    return {
        IsEmpty: jest.fn()
    }
});

jest.mock('../../rules/ForEachElement', () => {
    return {
        ForEachElement: jest.fn()
    }
});

describe('Test ArrayRuleValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.isEmpty).toBeDefined();
    expect(dummyRuleValidator.forEachElement).toBeDefined();
  });

  it('check if isEmpty rule is instantiated', () => {
    const result = dummyRuleValidator.isEmpty();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new IsEmpty());
    expect(result).toBeInstanceOf(ArrayRuleValidator);
  });

  it('check if forEachElement rule is instantiated', () => {
    const result = dummyRuleValidator.forEachElement(() => {});
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new ForEachElement(() => {}));
    expect(result).toBeInstanceOf(ArrayRuleValidator);
  });
});
