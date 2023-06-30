import { NotRuleValidator } from '../types/CommonRules';
import { NumberRules } from '../types/NumberRules';
import { LessThan } from '../rules/LessThan';
import { GreaterThan } from '../rules/GreaterThan';
import { Between } from '../rules/Between';
import { Rule } from '../Rule';
import { CommonRuleValidator } from './CommonRuleValidator';

export class NumberRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements NumberRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  /**
   * Check if value is less than provided value
   * @param  {number} value lower bound value
   * @param  {boolean} [equalTo] boolean for equality comparison
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public lessThan(
    value: number,
    equalTo?: boolean,
    customErrorMessage?: string
  ): NumberRuleValidator<TModel, TValue> {
    this.pushRule(new LessThan(value, equalTo, customErrorMessage));
    return this;
  }

  /**
   * Check if value is greater than provided value
   * @param  {number} value upper bound value
   * @param  {boolean} [equalTo] boolean for equality comparison
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly greaterThan = (
    value: number,
    equalTo?: boolean,
    customErrorMessage?: string
  ): NumberRuleValidator<TModel, TValue> => {
    this.pushRule(new GreaterThan(value, equalTo, customErrorMessage));
    return this;
  };

  /**
   * Check if value is between provided values
   * @param  {number} lowerBound lower bound value
   * @param  {number} upperBound upper bound value
   * @param  {boolean} [inclusiveLowerBound] boolean for lower bound inclusive comparison
   * @param  {boolean} [inclusiveUpperBound] boolean for upper bound inclusive comparison
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly between = (
    lowerBound: number,
    upperBound: number,
    inclusiveLowerBound?: boolean,
    inclusiveUpperBound?: boolean,
    customErrorMessage?: string
  ): NumberRuleValidator<TModel, TValue> => {
    this.pushRule(
      new Between(
        lowerBound,
        upperBound,
        inclusiveLowerBound,
        inclusiveUpperBound,
        customErrorMessage
      )
    );
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
