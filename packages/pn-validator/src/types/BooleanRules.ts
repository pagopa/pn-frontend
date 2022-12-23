import { CommonRules, NotRuleValidator } from './CommonRules';

export interface BooleanRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  readonly not: () => NotRuleValidator<TModel, TValue>;
}
