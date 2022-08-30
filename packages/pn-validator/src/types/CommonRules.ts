import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';
import { DateRuleValidator } from './../ruleValidators/DateRuleValidator';
import { ObjectRuleValidator } from './../ruleValidators/ObjectRuleValidator';
import { ArrayRuleValidator } from '../ruleValidators/ArrayRuleValidator';

type RuleValidators<TModel, TValue> =
  | StringRuleValidator<TModel, TValue>
  | NumberRuleValidator<TModel, TValue>
  | DateRuleValidator<TModel, TValue>
  | ObjectRuleValidator<TModel, TValue>
  | ArrayRuleValidator<TModel, TValue>;

export interface CommonRules<TModel, TValue> {
  isNull: (not?: boolean) => RuleValidators<TModel, TValue>;
  isUndefined: (not?: boolean) => RuleValidators<TModel, TValue>;
  isEqual: (value: TValue, not?: boolean) => RuleValidators<TModel, TValue>;
}
