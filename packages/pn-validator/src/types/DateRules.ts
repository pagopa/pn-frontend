import { DateRuleValidator } from '../ruleValidators/DateRuleValidator';
import { CommonRules, NotRuleValidator } from './CommonRules';

export interface DateRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  readonly lessThan: (value: Date, equalTo?: boolean) => DateRuleValidator<TModel, TValue>;
  readonly greaterThan: (value: Date, equalTo?: boolean) => DateRuleValidator<TModel, TValue>;
  readonly not: () => NotRuleValidator<TModel, TValue>;
}
