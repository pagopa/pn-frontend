import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';

type RuleValidators<TModel, TValue> = StringRuleValidator<TModel, TValue> | NumberRuleValidator<TModel, TValue>;

export interface CommonRules<TModel, TValue> {
    isNull: (not?: boolean) => RuleValidators<TModel, TValue>,
    isUndefined: (not?: boolean) => RuleValidators<TModel, TValue>,
    isEqual: (value: TValue, not?: boolean) => RuleValidators<TModel, TValue>
}