import { Rule } from '../Rule';
import { BooleanRules } from '../types/BooleanRules';
import { NotRuleValidator } from '../types/CommonRules';
import { CommonRuleValidator } from './CommonRuleValidator';

export class BooleanRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements BooleanRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  /**
   * Negate next rule
   */
  public readonly not = (): NotRuleValidator<TModel, TValue> =>
    ({
      ...this.commonNot(),
    } as unknown as NotRuleValidator<TModel, TValue>);
}
