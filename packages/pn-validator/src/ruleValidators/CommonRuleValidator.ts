import { Rule } from '../Rule';
// import { IsEmpty } from '../rules/IsEmpty';
import { CustomValidator } from '../rules/CustomValidator';
import { IsEqual } from '../rules/IsEqual';
import { IsNull } from '../rules/IsNull';
// import { Matches } from '../rules/Matches';
import { IsOneOf } from '../rules/IsOneOf';
import { IsUndefined } from '../rules/IsUndefined';
import { Required } from '../rules/Required';
import { NotRuleValidator } from '../types/CommonRules';
import { ValidationResult } from '../types/ValidationResult';

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

  private addRequiredRule = (customErrorMessage?: string) => {
    this.pushRule(new Required<TModel, TValue>(customErrorMessage));
    return this;
  };

  private addIsOneOfRule = (
    possibleValues: Array<TValue>,
    not: boolean,
    customErrorMessage?: string
  ) => {
    this.pushRule(new IsOneOf<TModel, TValue>(possibleValues, not, customErrorMessage));
    return this;
  };

  /**
   * Check if value is null
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isNull = (customErrorMessage?: string) =>
    this.addIsNullRule(false, customErrorMessage);

  /**
   * Check if value is undefined
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isUndefined = (customErrorMessage?: string) =>
    this.addIsUndefinedRule(false, customErrorMessage);

  /**
   * Check if value is equal to one provided
   * @param {boolean} value value to compare
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isEqual = (value: TValue, customErrorMessage?: string) =>
    this.addIsEqualRule(value, false, customErrorMessage);

  /**
   * Check if value is in (not in) the set provided
   * @param {TValue[]} value value to compare
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isOneOf = (possibleValues: Array<TValue>, customErrorMessage?: string) =>
    this.addIsOneOfRule(possibleValues, false, customErrorMessage);

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
   * Required
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isRequired = (customErrorMessage?: string) =>
    this.addRequiredRule(customErrorMessage);

  /**
   * Negate next rule
   */
  protected readonly commonNot = (): NotRuleValidator<TModel, TValue> =>
    ({
      isNull: (customErrorMessage?: string) => this.addIsNullRule(true, customErrorMessage),
      isUndefined: (customErrorMessage?: string) =>
        this.addIsUndefinedRule(true, customErrorMessage),
      isEqual: (value: TValue, customErrorMessage?: string) =>
        this.addIsEqualRule(value, true, customErrorMessage),
      isOneOf: (possibleValues: Array<TValue>, customErrorMessage?: string) =>
        this.addIsOneOfRule(possibleValues, true, customErrorMessage),
      isRequired: (customErrorMessage?: string) => this.addRequiredRule(customErrorMessage),
    } as unknown as NotRuleValidator<TModel, TValue>);
}
