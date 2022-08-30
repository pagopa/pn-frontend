import { DateRules } from '../types/DateRules';
import { LessThan } from '../rules/LessThan';
import { GreaterThan } from '../rules/GreaterThan';
import { Rule } from '../Rule';
import { CommonRuleValidator } from './CommonRuleValidator';

export class DateRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements DateRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  /**
   * Check if value is less than provided value
   * @param  {Date} value lower bound value
   * @param  {boolean} [equalTo] boolean for equality comparison
   */
  lessThan = (value: Date, equalTo?: boolean): DateRuleValidator<TModel, TValue> => {
    this.pushRule(new LessThan(value, equalTo));
    return this;
  };

  /**
   * Check if value is greater than provided value
   * @param  {Date} value upper bound value
   * @param  {boolean} [equalTo] boolean for equality comparison
   */
  greaterThan = (value: Date, equalTo?: boolean): DateRuleValidator<TModel, TValue> => {
    this.pushRule(new GreaterThan(value, equalTo));
    return this;
  };
}
