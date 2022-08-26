import { isArray } from './rules/IsArray';
import { isObject } from './rules/IsObject';
import { isNumber } from './rules/IsNumber';
import { isString } from './rules/IsString';
import { Rule } from './Rule';
import { ValidationResult } from './types/ValidationResult';
import { hasError } from './HasError';
import { TypeRules } from './types/TypeRules';
import { isDate } from './rules/IsDate';

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

  private getCommonRules = () => ({});

  private getStringRules = () => ({});

  private getNumberRules = () => ({});

  private getDateRules = () => ({});

  private getObjectRules = () => ({});

  private getIsArrayRules = () => ({});

  public getTypeRules = (): TypeRules<TModel, TValue> => ({
    isString: () => {
      this.pushRule(isString);
      return {
        ...this.getCommonRules(),
        ...this.getStringRules(),
      };
    },
    isNumber: () => {
      this.pushRule(isNumber);
      return {
        ...this.getCommonRules(),
        ...this.getNumberRules(),
      }
    },
    isDate: () => {
      this.pushRule(isDate);
      return {
        ...this.getCommonRules(),
        ...this.getDateRules(),
      }
    },
    isObject: () => {
      this.pushRule(isObject);
      return {
        ...this.getCommonRules(),
        ...this.getObjectRules(),
      }
    },
    isArray: () => {
      this.pushRule(isArray);
      return {
        ...this.getCommonRules(),
        ...this.getIsArrayRules(),
      }
    },
  });
}
