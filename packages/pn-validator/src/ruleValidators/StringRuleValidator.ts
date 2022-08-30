import { StringRules } from '../types/StringRules';
import { IsEmpty } from '../rules/IsEmpty';
import { Length } from '../rules/Length';
import { Matches } from '../rules/Matches';
import { Rule } from '../Rule';
import { CommonRuleValidator } from './CommonRuleValidator';

export class StringRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements StringRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  /**
   * Check if value is empty
   * @param {boolean} [not] boolean to evaluate negative condition
   */
  isEmpty = (not?: boolean): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new IsEmpty<TModel, TValue>(not));
    return this;
  };

  /**
   * Check if value has the desired length
   * @param {number} [minLength] min desired length
   * @param {number} [maxLength] max desired length
   */
  length = (minLength?: number, maxLength?: number): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new Length<TModel, TValue>(minLength, maxLength));
    return this;
  };

  /**
   * Check if value matches reqexp provided
   * @param {boolean} [not] boolean to evaluate negative condition
   */
  matches = (pattern: RegExp, not?: boolean): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new Matches<TModel, TValue>(pattern, not));
    return this;
  };
}
