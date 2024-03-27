import { IsEmpty } from '../../rules/IsEmpty';
import { Length } from '../../rules/Length';
import { Matches } from '../../rules/Matches';
import { StringRuleValidator } from '../StringRuleValidator';

const pushRuleMk = jest.fn();
const dummyRuleValidator = new StringRuleValidator(pushRuleMk);

jest.mock('../../rules/IsEmpty', () => {
  return {
    IsEmpty: jest.fn(),
  };
});

jest.mock('../../rules/Length', () => {
  return {
    Length: jest.fn(),
  };
});

jest.mock('../../rules/Matches', () => {
  return {
    Matches: jest.fn(),
  };
});

describe('Test StringRuleValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('check if methods exist', () => {
    expect(dummyRuleValidator.isEmpty).toBeDefined();
    expect(dummyRuleValidator.length).toBeDefined();
    expect(dummyRuleValidator.matches).toBeDefined();
  });

  it('check if isEmpty rule is instantiated', () => {
    const result = dummyRuleValidator.isEmpty();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new IsEmpty());
    expect(result).toBeInstanceOf(StringRuleValidator);
  });

  it('check if length rule is instantiated', () => {
    const result = dummyRuleValidator.length();
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new Length());
    expect(result).toBeInstanceOf(StringRuleValidator);
  });

  it('check if matches rule is instantiated', () => {
    const regexp = new RegExp(/prova/gi);
    const result = dummyRuleValidator.matches(regexp);
    expect(pushRuleMk).toBeCalledTimes(1);
    expect(pushRuleMk).toBeCalledWith(new Matches(regexp));
    expect(result).toBeInstanceOf(StringRuleValidator);
  });
});
