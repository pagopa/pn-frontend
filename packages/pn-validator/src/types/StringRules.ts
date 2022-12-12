import { StringRuleValidator } from '../ruleValidators/StringRuleValidator';
import { CommonRules, NotRuleValidator } from './CommonRules';

export type NotStringRuleValidator<TModel, TValue> = NotRuleValidator<TModel, TValue> & {
  readonly isEmpty: (customErrorMessage?: string) => StringRuleValidator<TModel, TValue>;
  readonly matches: (
    pattern: RegExp,
    customErrorMessage?: string
  ) => StringRuleValidator<TModel, TValue>;
}

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
  readonly not: () => NotStringRuleValidator<TModel, TValue>;
}
