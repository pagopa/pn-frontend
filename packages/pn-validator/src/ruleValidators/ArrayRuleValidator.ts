import { ArrayRules } from '../types/ArrayRules';
import { IsEmpty } from '../rules/IsEmpty';
import { Rule } from '../Rule';
import { CommonRuleValidator } from './CommonRuleValidator';

export class ArrayRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements ArrayRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  /**
   * Check if value is empty
   * @param {boolean} [not] boolean to evaluate negative condition
   */
  isEmpty = (not?: boolean): ArrayRuleValidator<TModel, TValue> => {
    this.pushRule(new IsEmpty<TModel, TValue>(not));
    return this;
  };
}
