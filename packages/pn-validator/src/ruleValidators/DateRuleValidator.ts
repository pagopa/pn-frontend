import { DateRules } from '../types/DateRules';
import { NotRuleValidator } from '../types/CommonRules';
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
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
   public readonly lessThan = (
    value: Date,
    equalTo?: boolean,
    customErrorMessage?: string
  ): DateRuleValidator<TModel, TValue> => {
    this.pushRule(new LessThan(value, equalTo, customErrorMessage));
    return this;
  };

  /**
   * Check if value is greater than provided value
   * @param  {Date} value upper bound value
   * @param  {boolean} [equalTo] boolean for equality comparison
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
   public readonly greaterThan = (
    value: Date,
    equalTo?: boolean,
    customErrorMessage?: string
  ): DateRuleValidator<TModel, TValue> => {
    this.pushRule(new GreaterThan(value, equalTo, customErrorMessage));
    return this;
  };

  /**
   * Negate next rule
   */
  public readonly not = (): NotRuleValidator<TModel, TValue> =>
    ({
      ...this._not(),
    } as unknown as NotRuleValidator<TModel, TValue>);
}
