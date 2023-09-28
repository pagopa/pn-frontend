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
import { BooleanRuleValidator } from '../ruleValidators/BooleanRuleValidator';
import { IsString } from './IsString';
import { IsNumber } from './IsNumber';
import { IsDate } from './IsDate';
import { IsObject } from './IsObject';
import { IsArray } from './IsArray';
import { IsBoolean } from './IsBoolean';

export class ForEachElement<TModel, TValue> extends Rule<TModel, TValue> {
  private rules: Array<{ isAsync: boolean; rule: Rule<TModel, TElemValue<TValue>> }> = [];

  constructor(elementValidator: (availableRules: TypeRules<TModel, TElemValue<TValue>>) => void) {
    super();
    elementValidator(this.getTypeRules());
  }

  private pushRule = (rule: Rule<TModel, TElemValue<TValue>>) => {
    // eslint-disable-next-line functional/immutable-data
    this.rules.push({ isAsync: false, rule });
  };

  private isString = () => {
    this.pushRule(new IsString());
    return new StringRuleValidator<TModel, TElemValue<TValue>>(this.pushRule);
  };

  private isNumber = () => {
    this.pushRule(new IsNumber());
    return new NumberRuleValidator<TModel, TElemValue<TValue>>(this.pushRule);
  };

  private isDate = () => {
    this.pushRule(new IsDate());
    return new DateRuleValidator<TModel, TElemValue<TValue>>(this.pushRule);
  };

  private isBoolean = () => {
    this.pushRule(new IsBoolean());
    return new BooleanRuleValidator<TModel, TElemValue<TValue>>(this.pushRule);
  };

  private isObject = () => {
    this.pushRule(new IsObject());
    return new ObjectRuleValidator<TModel, TElemValue<TValue>>(this.pushRule);
  };

  private isArray = () => {
    this.pushRule(new IsArray());
    return new ArrayRuleValidator<TModel, TElemValue<TValue>>(this.pushRule);
  };

  private getTypeRules = (): TypeRules<TModel, TElemValue<TValue>> =>
    ({
      isString: this.isString,
      isNumber: this.isNumber,
      isDate: this.isDate,
      isBoolean: this.isBoolean,
      isObject: this.isObject,
      isArray: this.isArray,
    } as unknown as TypeRules<TModel, TElemValue<TValue>>);

  public valueValidator = (value: TValue, model: TModel) => {
    if (!isDefined(value)) {
      return null;
    }
    if (isArray(value)) {
      const results: Array<ValidationResult<TElemValue<TValue>>> = [];
      // eval rules for each element
      for (const rule of this.rules) {
        // eslint-disable-next-line functional/no-let
        let index = 0;
        for (const el of value) {
          const result = rule.rule.validate(el as TElemValue<TValue>, model);

          // check if there are errors
          // eslint-disable-next-line functional/no-let
          let resultToAdd = null;
          if (hasError(result)) {
            resultToAdd = result;
          }
          if (results[index] === undefined) {
            // eslint-disable-next-line functional/immutable-data
            results.push(resultToAdd);
            continue;
          }
          // eslint-disable-next-line functional/immutable-data
          results[index] = resultToAdd;
          index++;
        }
        if (results.filter((r) => r === null).length < results.length) {
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
