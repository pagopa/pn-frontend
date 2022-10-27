import { ObjectRuleValidator } from '../ruleValidators/ObjectRuleValidator';
import { Validator } from '../Validator';
import { CommonRules } from './CommonRules';

export type ObjectNotRules = 'isEmpty';

export interface ObjectRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  readonly isEmpty: () => ObjectRuleValidator<TModel, TValue>;
  readonly setValidator: (validator: Validator<TValue>) => ObjectRuleValidator<TModel, TValue>;
}
