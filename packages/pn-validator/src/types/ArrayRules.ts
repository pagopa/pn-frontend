import { ArrayRuleValidator } from '../ruleValidators/ArrayRuleValidator';
import { CommonRules, NotRuleValidator } from './CommonRules';
import { TypeRules } from './TypeRules';

export type TElemValue<T> = T extends Array<infer U> ? U : T;

export type NotArrayRuleValidator<TModel, TValue> = NotRuleValidator<TModel, TValue> & {
  readonly isEmpty: () => ArrayRuleValidator<TModel, TValue>;
}

export interface ArrayRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  readonly isEmpty: () => ArrayRuleValidator<TModel, TValue>;
  readonly forEachElement: (
    elementValidator: (availableRules: TypeRules<TModel, TElemValue<TValue>>) => void
  ) => ArrayRuleValidator<TModel, TValue>;
  readonly not: () => NotArrayRuleValidator<TModel, TValue>;
}
