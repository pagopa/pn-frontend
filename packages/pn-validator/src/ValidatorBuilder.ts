import { hasError } from './HasError';
import { Rule } from './Rule';
import { ArrayRuleValidator } from './ruleValidators/ArrayRuleValidator';
import { BooleanRuleValidator } from './ruleValidators/BooleanRuleValidator';
import { DateRuleValidator } from './ruleValidators/DateRuleValidator';
import { NumberRuleValidator } from './ruleValidators/NumberRuleValidator';
import { ObjectRuleValidator } from './ruleValidators/ObjectRuleValidator';
import { StringRuleValidator } from './ruleValidators/StringRuleValidator';
import { IsArray } from './rules/IsArray';
import { IsBoolean } from './rules/IsBoolean';
import { IsDate } from './rules/IsDate';
import { IsNumber } from './rules/IsNumber';
import { IsObject } from './rules/IsObject';
import { IsString } from './rules/IsString';
import { TypeRules } from './types/TypeRules';
import { ValidationResult } from './types/ValidationResult';

export class ValidatorBuilder<TModel, TValue> {
  private rules: Array<{ isAsync: boolean; rule: Rule<TModel, TValue> }> = [];

  private pushRule = (rule: Rule<TModel, TValue>) => {
    // eslint-disable-next-line functional/immutable-data
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

  private isString = () => {
    this.pushRule(new IsString());
    return new StringRuleValidator<TModel, TValue>(this.pushRule);
  };

  private isNumber = () => {
    this.pushRule(new IsNumber());
    return new NumberRuleValidator<TModel, TValue>(this.pushRule);
  };

  private isDate = () => {
    this.pushRule(new IsDate());
    return new DateRuleValidator<TModel, TValue>(this.pushRule);
  };

  private isBoolean = () => {
    this.pushRule(new IsBoolean());
    return new BooleanRuleValidator<TModel, TValue>(this.pushRule);
  };

  private isObject = () => {
    this.pushRule(new IsObject());
    return new ObjectRuleValidator<TModel, TValue>(this.pushRule);
  };

  private isArray = () => {
    this.pushRule(new IsArray());
    return new ArrayRuleValidator<TModel, TValue>(this.pushRule);
  };

  public getTypeRules = (): TypeRules<TModel, TValue> =>
    ({
      isString: this.isString,
      isNumber: this.isNumber,
      isDate: this.isDate,
      isBoolean: this.isBoolean,
      isObject: this.isObject,
      isArray: this.isArray,
    } as unknown as TypeRules<TModel, TValue>);
}
