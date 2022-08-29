import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { CommonRules } from './CommonRules';

export interface NumberRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  lessThan: (value: number) => NumberRuleValidator<TModel, TValue>;
  lessThanOrEqualTo: (value: number) => NumberRuleValidator<TModel, TValue>;
  greaterThan: (value: number) => NumberRuleValidator<TModel, TValue>;
  greaterThanOrEqualTo: (value: number) => NumberRuleValidator<TModel, TValue>;
  exclusiveBetween: (
    lowerBound: number,
    upperBound: number
  ) => NumberRuleValidator<TModel, TValue>;
  inclusiveBetween: (
    lowerBound: number,
    upperBound: number
  ) => NumberRuleValidator<TModel, TValue>;
};
