import { ArrayRuleValidator } from '../ruleValidators/ArrayRuleValidator';
import { BooleanRuleValidator } from '../ruleValidators/BooleanRuleValidator';
import { DateRuleValidator } from '../ruleValidators/DateRuleValidator';
import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { StringRuleValidator } from '../ruleValidators/StringRuleValidator';

// When conditional types act on a generic type, they become distributive when given a union type
// Surrounding with [], we can avoid this behaviour
// check https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types to get more information
// the undefined | null union type is to allow validation on optional key
export type TypeRules<TModel, TValue> = [TValue] extends [String | undefined | null]
  ? { isString: () => StringRuleValidator<TModel, NonNullable<TValue>> }
  : [TValue] extends [Number | undefined | null]
  ? { isNumber: () => NumberRuleValidator<TModel, NonNullable<TValue>> }
  : [TValue] extends [Date | undefined | null]
  ? { isDate: () => DateRuleValidator<TModel, NonNullable<TValue>> }
  : [TValue] extends [Boolean | undefined | null]
  ? { isBoolean: () => BooleanRuleValidator<TModel, NonNullable<TValue>> }
  : [TValue] extends [Array<infer _TEachValue> | undefined | null]
  ? { isArray: () => ArrayRuleValidator<TModel, NonNullable<TValue>> }
  : [TValue] extends [object | undefined | null]
  ? { isObject: () => ObjectRuleValidator<TModel, NonNullable<TValue>> }
  : never;
