import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from './../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from './../ruleValidators/ArrayRuleValidator';
import { CommonRuleValidator } from '../ruleValidators/CommonRuleValidator';
import { Validator } from '../Validator';

type MixedType = String | Number | Date | Boolean;

type StringTypeRules<TModel, TValue> = [TValue] extends [String | undefined | null]
  ? StringRuleValidator<TModel, TValue>
  : {};

type NumberTypeRules<TModel, TValue> = [TValue] extends [Number | undefined | null]
  ? NumberRuleValidator<TModel, TValue>
  : {};

type DateTypeRules<TModel, TValue> = [TValue] extends [Date | undefined | null]
  ? DateRuleValidator<TModel, TValue>
  : {};

type BoolenaTypeRules<TModel, TValue> = [TValue] extends [Boolean | undefined | null]
  ? CommonRuleValidator<TModel, TValue>
  : {};

type ArrayTypeRules<TModel, TValue> = [TValue] extends [Array<infer _TEachValue> | undefined | null]
  ? ArrayRuleValidator<TModel, TValue>
  : {};

type ObjectTypeRules<TModel, TValue> = [TValue] extends [object | undefined | null]
  ? TValue extends Array<infer _TEachValue>
    ? {}
    : TValue extends MixedType
    ? {}
    : ObjectRuleValidator<TModel, TValue>
  : {};

export type TypeRules<TModel, TValue> = StringTypeRules<TModel, TValue> &
  NumberTypeRules<TModel, TValue> &
  DateTypeRules<TModel, TValue> &
  BoolenaTypeRules<TModel, TValue> &
  ArrayTypeRules<TModel, TValue> &
  ObjectTypeRules<TModel, TValue>;
