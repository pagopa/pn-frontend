import { NumberRules } from './types/NumberRules';
import { hasError } from './HasError';
import { Rule } from './Rule';
import { ValidationResult } from './types/ValidationResult';
import { TypeRules } from './types/TypeRules';
import { CommonRules } from './types/CommonRules';
import { StringRules } from './types/StringRules';
import { IsArray } from './rules/IsArray';
import { IsObject } from './rules/IsObject';
import { IsNumber } from './rules/IsNumber';
import { IsString } from './rules/IsString';
import { IsDate } from './rules/IsDate';
import { IsNull } from './rules/IsNull';
import { IsUndefined } from './rules/IsUndefined';
import { IsEqual } from './rules/IsEqual';

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

  private commonRules: CommonRules<TModel, TValue> = {
    isNull: (not?: boolean) => {
      this.pushRule(new IsNull(not));
      return {
        ...this.commonRules
      };
    },
    isUndefined: (not?: boolean) => {
      this.pushRule(new IsUndefined(not));
      return {
        ...this.commonRules
      };
    },
    isEqual: (value: TValue, not?: boolean) => {
      this.pushRule(new IsEqual(value, not));
      return {
        ...this.commonRules
      };
    },
  };

  private stringRules: StringRules<TModel, TValue> = {
    isEmpty: (not?: boolean) => {
      return this.stringRules;
    },
    length: (minLength?: number, maxLength?: number) => {
      return this.stringRules;
    },
    matches: (pattern: RegExp, not?: boolean) => {
      return this.stringRules;
    },
    ...this.commonRules
  };

  private numberRules: NumberRules<TModel, TValue> = {
    lessThan: (value: number) => {
      return this.numberRules;
    },
    lessThanOrEqualTo: (value: number) => {
      return this.numberRules;
    },
    greaterThan: (value: number) => {
      return this.numberRules;
    },
    greaterThanOrEqualTo: (value: number) => {
      return this.numberRules;
    },
    exclusiveBetween: (
      lowerBound: number,
      upperBound: number
    ) => {
      return this.numberRules;
    },
    inclusiveBetween: (
      lowerBound: number,
      upperBound: number
    ) => {
      return this.numberRules;
    },
    ...this.commonRules
  };

  private getDateRules = () => ({});

  private getObjectRules = () => ({});

  private getIsArrayRules = () => ({});

  public getTypeRules = (): TypeRules<TModel, TValue> => ({
    isString: () => {
      this.pushRule(new IsString());
      return {
        ...this.stringRules,
      };
    },
    isNumber: () => {
      this.pushRule(new IsNumber());
      return {
        ...this.numberRules,
      }
    },
    isDate: () => {
      const dateRules = this.getDateRules();
      this.pushRule(new IsDate());
      return {
        ...dateRules,
      }
    },
    isObject: () => {
      const objectRules = this.getObjectRules();
      this.pushRule(new IsObject());
      return {
        ...objectRules,
      }
    },
    isArray: () => {
      const arrayRules = this.getIsArrayRules();
      this.pushRule(new IsArray());
      return {
        ...arrayRules,
      }
    },
  });

  ciao = () => {
    this.getTypeRules().isString().isEmpty().
  };
}
