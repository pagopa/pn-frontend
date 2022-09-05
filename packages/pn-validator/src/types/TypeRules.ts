import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from './../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from './../ruleValidators/ArrayRuleValidator';

type MixedType = String | Number | Date;

export type TypeRules<TModel, TValue> = (TValue extends String
  ? StringRuleValidator<TModel, TValue>
  : {}) &
  (TValue extends Number ? NumberRuleValidator<TModel, TValue> : {}) &
  (TValue extends Date ? DateRuleValidator<TModel, TValue> : {}) &
  (TValue extends Array<infer _TEachValue> ? ArrayRuleValidator<TModel, TValue> : {}) &
  (TValue extends object
    ? TValue extends Array<infer _TEachValue>
      ? {}
      : TValue extends MixedType
      ? {}
      : ObjectRuleValidator<TModel, TValue>
    : {});
