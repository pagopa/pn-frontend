import { ArrayRuleValidator } from '../ruleValidators/ArrayRuleValidator';
import { BooleanRuleValidator } from '../ruleValidators/BooleanRuleValidator';
import { DateRuleValidator } from '../ruleValidators/DateRuleValidator';
import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { StringRuleValidator } from '../ruleValidators/StringRuleValidator';
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
  readonly isOneOf: (possibleValues: Array<TValue>) => RuleValidators<TModel, TValue>;
};

export interface CommonRules<TModel, TValue> {
  readonly isNull: () => RuleValidators<TModel, TValue>;
  readonly isUndefined: () => RuleValidators<TModel, TValue>;
  readonly isEqual: (value: TValue) => RuleValidators<TModel, TValue>;
  readonly isOneOf: (possibleValues: Array<TValue>) => RuleValidators<TModel, TValue>;
  readonly customValidator: (
    validator: (value: TValue, model: TModel) => ValidationResult<TValue>
  ) => RuleValidators<TModel, TValue>;
  readonly not: () => NotRuleValidator<TModel, TValue>;
}
