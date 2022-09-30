import { DateRuleValidator } from '../ruleValidators/DateRuleValidator';
import { CommonRules } from './CommonRules';

export interface DateRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  lessThan: (value: Date, equalTo?: boolean) => DateRuleValidator<TModel, TValue>;
  greaterThan: (value: Date, equalTo?: boolean) => DateRuleValidator<TModel, TValue>;
}