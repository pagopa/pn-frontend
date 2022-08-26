import { CommonRules } from './CommonRules';

export interface NumberRules<TModel, TValue> extends CommonRules<TModel, TValue> {
  lessThan: (value: number) => NumberRules<TModel, TValue>;
  lessThanOrEqualTo: (value: number) => NumberRules<TModel, TValue>;
  greaterThan: (value: number) => NumberRules<TModel, TValue>;
  greaterThanOrEqualTo: (value: number) => NumberRules<TModel, TValue>;
  exclusiveBetween: (
    lowerBound: number,
    upperBound: number
  ) => NumberRules<TModel, TValue>;
  inclusiveBetween: (
    lowerBound: number,
    upperBound: number
  ) => NumberRules<TModel, TValue>;
};
