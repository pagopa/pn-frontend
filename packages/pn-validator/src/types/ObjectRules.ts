import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { Validator } from '../Validator';
import { CommonRules, NotRuleValidator } from './CommonRules';

export type NotObjectRuleValidator<TModel, TValue> = NotRuleValidator<TModel, TValue> & {
  readonly isEmpty: () => ObjectRuleValidator<TModel, TValue>;
}

export interface ObjectRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  readonly isEmpty: () => ObjectRuleValidator<TModel, TValue>;
  readonly setValidator: (validator: Validator<TValue>) => ObjectRuleValidator<TModel, TValue>;
  readonly not: () => NotObjectRuleValidator<TModel, TValue>;
}
