import { NotRuleValidator } from '../types/CommonRules';
import { IsEqual } from '../rules/IsEqual';
import { IsNull } from '../rules/IsNull';
import { IsUndefined } from '../rules/IsUndefined';
import { IsEmpty } from '../rules/IsEmpty';
import { CustomValidator } from '../rules/CustomValidator';
import { ValidationResult } from '../types/ValidationResult';
import { Rule } from '../Rule';
import { Matches } from '../rules/Matches';
import { IsOneOf } from '../rules/IsOneOf';

export abstract class CommonRuleValidator<TModel, TValue> {
  protected pushRule: (rule: Rule<TModel, TValue>) => void;

  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    this.pushRule = pushRule;
  }

  private addIsNullRule = (not: boolean, customErrorMessage?: string) => {
    this.pushRule(new IsNull<TModel, TValue>(not, customErrorMessage));
    return this;
  };

  private addIsUndefinedRule = (not: boolean, customErrorMessage?: string) => {
    this.pushRule(new IsUndefined<TModel, TValue>(not, customErrorMessage));
    return this;
  };

  private addIsEqualRule = (value: TValue, not: boolean, customErrorMessage?: string) => {
    this.pushRule(new IsEqual<TModel, TValue>(value, not, customErrorMessage));
    return this;
  };

  /**
   * Check if value is null
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isNull = (customErrorMessage?: string) => {
    return this.addIsNullRule(false, customErrorMessage);
  };

  /**
   * Check if value is undefined
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isUndefined = (customErrorMessage?: string) => {
    return this.addIsUndefinedRule(false, customErrorMessage);
  };

  /**
   * Check if value is equal to one provided
   * @param {boolean} value value to compare
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isEqual = (value: TValue, customErrorMessage?: string) => {
    return this.addIsEqualRule(value, false, customErrorMessage);
  };

  /**
   * Check if value is in (not in) the set provided
   * @param {TValue[]} value value to compare
   * @param {boolean} [not] boolean to evaluate negative condition
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public isOneOf = (possibleValues: TValue[], not?: boolean, customErrorMessage?: string) => {
    this.pushRule(new IsOneOf<TModel, TValue>(possibleValues, not, customErrorMessage));
    return this;
  };

  /**
   * Run custom validator
   * @param {boolean} validator custom validator
   */
  public readonly customValidator = (
    validator: (value: TValue, model: TModel) => ValidationResult<TValue>
  ) => {
    this.pushRule(new CustomValidator<TModel, TValue>(validator));
    return this;
  };

  /**
   * Negate next rule
   */
  public readonly not = (): NotRuleValidator<TModel, TValue> =>
    ({
      isNull: (customErrorMessage?: string) => {
        return this.addIsNullRule(true, customErrorMessage);
      },
      isUndefined: (customErrorMessage?: string) => {
        return this.addIsUndefinedRule(true, customErrorMessage);
      },
      isEqual: (value: TValue, customErrorMessage?: string) => {
        return this.addIsEqualRule(value, true, customErrorMessage);
      },
      isEmpty: (customErrorMessage?: string) => {
        this.pushRule(new IsEmpty<TModel, TValue>(true, customErrorMessage));
        return this;
      },
      matches: (pattern: RegExp, customErrorMessage?: string) => {
        this.pushRule(new Matches<TModel, TValue>(pattern, true, customErrorMessage));
        return this;
      },
    } as unknown as NotRuleValidator<TModel, TValue>);
}
