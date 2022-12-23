import { BooleanRuleValidator } from './../ruleValidators/BooleanRuleValidator';
import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from './../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from './../ruleValidators/ArrayRuleValidator';

// When conditional types act on a generic type, they become distributive when given a union type
// Surrounding with [], we can avoid this behaviour
// check https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types to get more information
// the undefined | null union type is to allow validation on optional key
export type TypeRules<TModel, TValue> = [TValue] extends [String | undefined | null]
  ? { isString: () => StringRuleValidator<TModel, TValue> }
  : [TValue] extends [Number | undefined | null]
  ? { isNumber: () => NumberRuleValidator<TModel, TValue> }
  : [TValue] extends [Date | undefined | null]
  ? { isDate: () => DateRuleValidator<TModel, TValue> }
  : [TValue] extends [Boolean | undefined | null]
  ? { isBoolean: () => BooleanRuleValidator<TModel, TValue> }
  : [TValue] extends [Array<infer _TEachValue> | undefined | null]
  ? { isArray: () => ArrayRuleValidator<TModel, TValue> }
  : TValue extends object
  ? { isObject: () => ObjectRuleValidator<TModel, TValue> }
  : {};
