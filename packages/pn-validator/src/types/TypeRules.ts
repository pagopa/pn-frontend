import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from './../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from './../ruleValidators/ArrayRuleValidator';
import { CommonRuleValidator } from '../ruleValidators/CommonRuleValidator';

export type TypeRules<TModel, TValue> = [TValue] extends [String | undefined | null]
  ? { isString: () => StringRuleValidator<TModel, TValue> }
  : [TValue] extends [Number | undefined | null]
  ? { isNumber: () => NumberRuleValidator<TModel, TValue> }
  : [TValue] extends [Date | undefined | null]
  ? { isDate: () => DateRuleValidator<TModel, TValue> }
  : [TValue] extends [Boolean | undefined | null]
  ? { isBoolean: () => CommonRuleValidator<TModel, TValue> }
  : [TValue] extends [Array<infer _TEachValue> | undefined | null]
  ? { isArray: () => ArrayRuleValidator<TModel, TValue> }
  : TValue extends object
  ? { isObject: () => ObjectRuleValidator<TModel, TValue> }
  : {};
