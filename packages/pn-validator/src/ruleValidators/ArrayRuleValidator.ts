import { ArrayRules, NotArrayRuleValidator, TElemValue } from '../types/ArrayRules';
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

  private addIsEmptyRule = (
    not: boolean,
    customErrorMessage?: string
  ): ArrayRuleValidator<TModel, TValue> => {
    this.pushRule(new IsEmpty<TModel, TValue>(not, customErrorMessage));
    return this;
  };

  /**
   * Check if value is empty
   * @param {string} [customErrorMessage] custom message to show when validation fails
   */
  public readonly isEmpty = (customErrorMessage?: string): ArrayRuleValidator<TModel, TValue> => {
    return this.addIsEmptyRule(false, customErrorMessage);
  };

  /**
   * Check rules for each element of the array
   */
   public readonly forEachElement = (
    elementValidator: (availableRules: TypeRules<TModel, TElemValue<TValue>>) => void
  ): ArrayRuleValidator<TModel, TValue> => {
    this.pushRule(new ForEachElement<TModel, TValue>(elementValidator));
    return this;
  };

  /**
   * Negate next rule
   */
  public readonly not = (): NotArrayRuleValidator<TModel, TValue> =>
    ({
      ...this._not(),
      isEmpty: (customErrorMessage?: string) => {
        return this.addIsEmptyRule(true, customErrorMessage);
      },
    } as unknown as NotArrayRuleValidator<TModel, TValue>);
}
