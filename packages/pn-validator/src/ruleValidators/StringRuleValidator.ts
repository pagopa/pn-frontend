import { NotStringRuleValidator, StringRules } from '../types/StringRules';
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

  private addIsEmptyRule = (
    not: boolean,
    customErrorMessage?: string
  ): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new IsEmpty<TModel, TValue>(not, customErrorMessage));
    return this;
  };

  private addMatchesRule = (
    pattern: RegExp,
    not: boolean,
    customErrorMessage?: string
  ): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new Matches<TModel, TValue>(pattern, not, customErrorMessage));
    return this;
  };

  /**
   * Check if value is empty
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isEmpty = (customErrorMessage?: string): StringRuleValidator<TModel, TValue> => {
    return this.addIsEmptyRule(false, customErrorMessage);
  };

  /**
   * Check if value has the desired length
   * @param {number} [minLength] min desired length
   * @param {number} [maxLength] max desired length
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly length = (
    minLength?: number,
    maxLength?: number,
    customErrorMessage?: string
  ): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new Length<TModel, TValue>(minLength, maxLength, customErrorMessage));
    return this;
  };

  /**
   * Check if value matches reqexp provided
   * @param {RegExp} pattern regexp to test
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly matches = (
    pattern: RegExp,
    customErrorMessage?: string
  ): StringRuleValidator<TModel, TValue> => {
    return this.addMatchesRule(pattern, false, customErrorMessage);
  };

  /**
   * Negate next rule
   */
  public readonly not = (): NotStringRuleValidator<TModel, TValue> =>
    ({
      ...this._not(),
      isEmpty: (customErrorMessage?: string) => {
        return this.addIsEmptyRule(true, customErrorMessage);
      },
      matches: (pattern: RegExp, customErrorMessage?: string) => {
        return this.addMatchesRule(pattern, true, customErrorMessage);
      },
    } as unknown as NotStringRuleValidator<TModel, TValue>);
}
