import { BooleanRules } from '../types/BooleanRules';
import { Rule } from '../Rule';
import { CommonRuleValidator } from './CommonRuleValidator';
import { NotRuleValidator } from '../types/CommonRules';

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
      ...this._not()
    } as unknown as NotRuleValidator<TModel, TValue>);
}