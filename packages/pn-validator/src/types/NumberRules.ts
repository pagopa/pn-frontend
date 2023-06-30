import { NumberRuleValidator } from '../ruleValidators/NumberRuleValidator';
import { CommonRules, NotRuleValidator } from './CommonRules';

export interface NumberRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  readonly lessThan: (value: number, equalTo?: boolean) => NumberRuleValidator<TModel, TValue>;
  readonly greaterThan: (value: number, equalTo?: boolean) => NumberRuleValidator<TModel, TValue>;
  readonly between: (
    lowerBound: number,
    upperBound: number,
    inclusiveLowerBound?: boolean,
    inclusiveUpperBound?: boolean
  ) => NumberRuleValidator<TModel, TValue>;
  readonly not: () => NotRuleValidator<TModel, TValue>;
}
