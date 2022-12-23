import { BooleanRuleValidator } from './../ruleValidators/BooleanRuleValidator';
import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from '../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from '../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from '../ruleValidators/ArrayRuleValidator';
import { ValidationResult } from './ValidationResult';

export type RuleValidators<TModel, TValue> =
  | StringRuleValidator<TModel, TValue>
  | NumberRuleValidator<TModel, TValue>
  | DateRuleValidator<TModel, TValue>
  | ObjectRuleValidator<TModel, TValue>
  | ArrayRuleValidator<TModel, TValue>
  | BooleanRuleValidator<TModel, TValue>;

export type NotRuleValidator<TModel, TValue> = {
  readonly isNull: () => RuleValidators<TModel, TValue>;
  readonly isUndefined: () => RuleValidators<TModel, TValue>;
  readonly isEqual: (value: TValue) => RuleValidators<TModel, TValue>;
  readonly isOneOf: (possibleValues: TValue[]) => RuleValidators<TModel, TValue>;
};

export interface CommonRules<TModel, TValue> {
  readonly isNull: () => RuleValidators<TModel, TValue>;
  readonly isUndefined: () => RuleValidators<TModel, TValue>;
  readonly isEqual: (value: TValue) => RuleValidators<TModel, TValue>;
  readonly isOneOf: (possibleValues: TValue[]) => RuleValidators<TModel, TValue>;
  readonly customValidator: (
    validator: (value: TValue, model: TModel) => ValidationResult<TValue>
  ) => RuleValidators<TModel, TValue>;
  readonly not: () => NotRuleValidator<TModel, TValue>;
}
