import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from '../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from '../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from '../ruleValidators/ArrayRuleValidator';
import { CommonRuleValidator } from '../ruleValidators/CommonRuleValidator';
import { ValidationResult } from './ValidationResult';

type RuleValidators<TModel, TValue> =
  | StringRuleValidator<TModel, TValue>
  | NumberRuleValidator<TModel, TValue>
  | DateRuleValidator<TModel, TValue>
  | ObjectRuleValidator<TModel, TValue>
  | ArrayRuleValidator<TModel, TValue>;

type CommonNotRules = 'isNull' | 'isUndefined' | 'isEqual';

export type NotRuleValidator<TModel, TValue> = [TValue] extends [String | undefined | null]
  ? Pick<StringRuleValidator<TModel, TValue>, CommonNotRules | 'isEmpty' | 'matches'>
  : [TValue] extends [Number | undefined | null]
  ? Pick<NumberRuleValidator<TModel, TValue>, CommonNotRules>
  : [TValue] extends [Date | undefined | null]
  ? Pick<DateRuleValidator<TModel, TValue>, CommonNotRules>
  : [TValue] extends [Boolean | undefined | null]
  ? Pick<CommonRuleValidator<TModel, TValue>, CommonNotRules>
  : [TValue] extends [Array<infer _TEachValue> | undefined | null]
  ? Pick<ArrayRuleValidator<TModel, TValue>, CommonNotRules | 'isEmpty'>
  : TValue extends object
  ? Pick<ObjectRuleValidator<TModel, TValue>, CommonNotRules | 'isEmpty'>
  : {};

export interface CommonRules<TModel, TValue> {
  readonly isNull: () => RuleValidators<TModel, TValue>;
  readonly isUndefined: () => RuleValidators<TModel, TValue>;
  readonly isEqual: (value: TValue) => RuleValidators<TModel, TValue>;
  readonly customValidator: (
    validator: (value: TValue, model: TModel) => ValidationResult<TValue>
  ) => RuleValidators<TModel, TValue>;
  readonly not: () => NotRuleValidator<TModel, TValue>;
}
