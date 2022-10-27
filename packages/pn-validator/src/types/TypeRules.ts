import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from './../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from './../ruleValidators/ArrayRuleValidator';
import { CommonRuleValidator } from '../ruleValidators/CommonRuleValidator';

export type TypeRules<TModel, TValue> = [TValue] extends [String | undefined | null]
  ? StringRuleValidator<TModel, TValue>
  : [TValue] extends [Number | undefined | null]
  ? NumberRuleValidator<TModel, TValue>
  : [TValue] extends [Date | undefined | null]
  ? DateRuleValidator<TModel, TValue>
  : [TValue] extends [Boolean | undefined | null]
  ? CommonRuleValidator<TModel, TValue>
  : [TValue] extends [Array<infer _TEachValue> | undefined | null]
  ? ArrayRuleValidator<TModel, TValue>
  : TValue extends object
  ? ObjectRuleValidator<TModel, TValue>
  : {};
