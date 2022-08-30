import { ValidationResult } from './types/ValidationResult';
import { TypeRules } from './types/TypeRules';
import { IsArray } from './rules/IsArray';
import { IsObject } from './rules/IsObject';
import { IsNumber } from './rules/IsNumber';
import { IsString } from './rules/IsString';
import { IsDate } from './rules/IsDate';
import { StringRuleValidator } from './ruleValidators/StringRuleValidator';
import { NumberRuleValidator } from './ruleValidators/NumberRuleValidator';
import { DateRuleValidator } from './ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from './ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from './ruleValidators/ArrayRuleValidator';
import { hasError } from './HasError';
import { Rule } from './Rule';

export class ValidatorBuilder<TModel, TValue> {
  private rules: Array<{ isAsync: boolean; rule: Rule<TModel, TValue> }> = [];

  private pushRule = (rule: Rule<TModel, TValue>) => {
    this.rules.push({ isAsync: false, rule });
  };

  /*
  private pushAsyncRule = (rule: AsyncRule<TModel, TValue>) => {
    this.rules.push({ isAsync: true, rule });
  };
  */

  public validate = (value: TValue, model: TModel): ValidationResult<TValue> => {
    // loop over rules
    for (const rule of this.rules) {
      const result = rule.rule.validate(value, model);

      // check if there are errors
      if (hasError(result)) {
        return result;
      }
    }

    return null;
  };

  public getTypeRules = (): TypeRules<TModel, TValue> => ({
    isString: () => {
      this.pushRule(new IsString());
      return new StringRuleValidator<TModel, TValue>(this.pushRule);
    },
    isNumber: () => {
      this.pushRule(new IsNumber());
      return new NumberRuleValidator<TModel, TValue>(this.pushRule);
    },
    isDate: () => {
      this.pushRule(new IsDate());
      return new DateRuleValidator<TModel, TValue>(this.pushRule);
    },
    isObject: () => {
      this.pushRule(new IsObject());
      return new ObjectRuleValidator<TModel, TValue>(this.pushRule);
    },
    isArray: () => {
      this.pushRule(new IsArray());
      return new ArrayRuleValidator<TModel, TValue>(this.pushRule);
    },
  });
}
