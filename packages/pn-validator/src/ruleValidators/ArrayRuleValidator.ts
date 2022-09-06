import { ArrayRules, TElemValue } from '../types/ArrayRules';
import { IsEmpty } from '../rules/IsEmpty';
import { ForEachElement } from '../rules/ForEachElement';
import { Rule } from '../Rule';
import { TypeRules } from '../types/TypeRules';
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
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  isEmpty = (not?: boolean, customErrorMessage?: string): ArrayRuleValidator<TModel, TValue> => {
    this.pushRule(new IsEmpty<TModel, TValue>(not, customErrorMessage));
    return this;
  };

  /**
   * Check rules for each element of the array
   */
   forEachElement = (elementValidator: (availableRules: TypeRules<TModel, TElemValue<TValue>>) => void): ArrayRuleValidator<TModel, TValue> => {
    this.pushRule(new ForEachElement<TModel, TValue>(elementValidator));
    return this;
  };
}
