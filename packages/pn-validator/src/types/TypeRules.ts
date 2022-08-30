import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from './../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from './../ruleValidators/ArrayRuleValidator';

export type TypeRules<TModel, TValue> = {
  isString: () => StringRuleValidator<TModel, TValue>;
  isNumber: () => NumberRuleValidator<TModel, TValue>;
  isDate: () => DateRuleValidator<TModel, TValue>;
  isObject: () => ObjectRuleValidator<TModel, TValue>;
  isArray: () => ArrayRuleValidator<TModel, TValue>;
};
