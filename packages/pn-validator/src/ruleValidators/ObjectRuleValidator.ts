import { Rule } from '../Rule';
import { Validator } from '../Validator';
import { InnerValidator } from '../rules/InnerValidator';
import { IsEmpty } from '../rules/IsEmpty';
import { NotObjectRuleValidator, ObjectRules } from '../types/ObjectRules';
import { CommonRuleValidator } from './CommonRuleValidator';

export class ObjectRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements ObjectRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  private addIsEmptyRule = (not: boolean, customErrorMessage?: string): this => {
    this.pushRule(new IsEmpty<TModel, TValue>(not, customErrorMessage));
    return this;
  };

  /**
   * Check if value is empty
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isEmpty = (customErrorMessage?: string): this =>
    this.addIsEmptyRule(false, customErrorMessage);

  /**
   * Set validator to validate properties of type object
   * @param {Validator} [validator] validator
   */
  public readonly setValidator = (validator: Validator<TValue>): this => {
    this.pushRule(new InnerValidator<TModel, TValue>(validator));
    return this;
  };

  /**
   * Negate next rule
   */
  public readonly not = (): NotObjectRuleValidator<TModel, TValue> =>
    ({
      ...this.commonNot(),
      isEmpty: (customErrorMessage?: string) => this.addIsEmptyRule(true, customErrorMessage),
    } as NotObjectRuleValidator<TModel, TValue>);
}
