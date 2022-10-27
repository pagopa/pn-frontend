import { isArray } from '../utility/IsArray';
import { isDefined } from '../utility/IsDefined';
import { TypeRules } from '../types/TypeRules';
import { TElemValue } from '../types/ArrayRules';
import { ValidationResult } from '../types/ValidationResult';
import { StringRuleValidator } from '../ruleValidators/StringRuleValidator';
import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { DateRuleValidator } from '../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from '../ruleValidators/ArrayRuleValidator';
import { Rule } from '../Rule';
import { hasError } from '../HasError';

export class ForEachElement<TModel, TValue> extends Rule<TModel, TValue> {
  private rules: Array<{ isAsync: boolean; rule: Rule<TModel, TElemValue<TValue>> }> = [];

  constructor(elementValidator: (availableRules: TypeRules<TModel, TElemValue<TValue>>) => void) {
    super();
    elementValidator(this.getTypeRules());
  }

  private pushRule = (rule: Rule<TModel,  TElemValue<TValue>>) => {
    this.rules.push({ isAsync: false, rule });
  };

  private getTypeRules = (): TypeRules<TModel,  TElemValue<TValue>> =>
    ({
      ...new StringRuleValidator<TModel,  TElemValue<TValue>>(this.pushRule),
      ...new NumberRuleValidator<TModel,  TElemValue<TValue>>(this.pushRule),
      ...new DateRuleValidator<TModel,  TElemValue<TValue>>(this.pushRule),
      ...new ObjectRuleValidator<TModel,  TElemValue<TValue>>(this.pushRule),
      ...new ArrayRuleValidator<TModel,  TElemValue<TValue>>(this.pushRule),
    } as unknown as TypeRules<TModel,  TElemValue<TValue>>);

  public valueValidator = (value: TValue, model: TModel) => {
    if (!isDefined(value)) {
      return null;
    }
    if (isArray(value)) {
      const results: Array<ValidationResult<TElemValue<TValue>>> = [];
      // eval rules for each element
      for (const rule of this.rules) {
        for (const el of value) {
          const result = rule.rule.validate(el as TElemValue<TValue>, model);

          // check if there are errors
          if (hasError(result)) {
            results.push(result);
            continue;
          }
          results.push(null);
        }
        if (results.length > 0) {
          break;
        }
      }
      if (results.length > 0) {
        return results as ValidationResult<TValue>;
      }
      return null;
    }
    return null;
  };
}
