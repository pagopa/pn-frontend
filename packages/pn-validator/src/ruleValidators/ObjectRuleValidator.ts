import { NotObjectRuleValidator, ObjectRules } from '../types/ObjectRules';
import { IsEmpty } from '../rules/IsEmpty';
import { InnerValidator } from '../rules/InnerValidator';
import { Rule } from '../Rule';
import { Validator } from '../Validator';
import { CommonRuleValidator } from './CommonRuleValidator';

export class ObjectRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements ObjectRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  private addIsEmptyRule = (
    not: boolean,
    customErrorMessage?: string
  ): ObjectRuleValidator<TModel, TValue> => {
    this.pushRule(new IsEmpty<TModel, TValue>(not, customErrorMessage));
    return this;
  };

  /**
   * Check if value is empty
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
   public readonly isEmpty = (customErrorMessage?: string): ObjectRuleValidator<TModel, TValue> => {
    return this.addIsEmptyRule(false, customErrorMessage);
  };

  /**
   * Set validator to validate properties of type object
   * @param {Validator} [validator] validator
   */
   public readonly  setValidator = (
    validator: Validator<TValue>
  ): ObjectRuleValidator<TModel, TValue> => {
    this.pushRule(new InnerValidator<TModel, TValue>(validator));
    return this;
  };

  /**
   * Negate next rule
   */
  public readonly not = (): NotObjectRuleValidator<TModel, TValue> =>
    ({
      ...this._not(),
      isEmpty: (customErrorMessage?: string) => {
        return this.addIsEmptyRule(true, customErrorMessage);
      },
    } as unknown as NotObjectRuleValidator<TModel, TValue>);
}
