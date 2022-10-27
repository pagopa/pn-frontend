import { StringRuleValidator } from '../ruleValidators/StringRuleValidator';
import { CommonRules } from './CommonRules';

export interface StringRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  readonly isEmpty: (customErrorMessage?: string) => StringRuleValidator<TModel, TValue>;
  readonly length: (
    minLength?: number,
    maxLength?: number,
    customErrorMessage?: string
  ) => StringRuleValidator<TModel, TValue>;
  readonly matches: (
    pattern: RegExp,
    customErrorMessage?: string
  ) => StringRuleValidator<TModel, TValue>;
}
