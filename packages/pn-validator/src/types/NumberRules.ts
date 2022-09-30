import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { CommonRules } from './CommonRules';

export interface NumberRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  lessThan: (value: number, equalTo?: boolean) => NumberRuleValidator<TModel, TValue>;
  greaterThan: (value: number, equalTo?: boolean) => NumberRuleValidator<TModel, TValue>;
  between: (
    lowerBound: number,
    upperBound: number,
    inclusiveLowerBound?: boolean,
    inclusiveUpperBound?: boolean
  ) => NumberRuleValidator<TModel, TValue>;
}
