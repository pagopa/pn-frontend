import { NumberRules } from './NumberRules';
import { CommonRules } from './CommonRules';
import { StringRules } from './StringRules';

export type CommonAndDateRules<TModel, TValue> = CommonRules<TModel, TValue>;

export type AllRulesByType<TModel, TValue> = (TValue extends string | null | undefined
  ? StringRules<TModel, TValue>
  : {}) &
  (TValue extends number | null | undefined ? NumberRules<TModel, TValue> : {});

export type AllRules<TModel, TValue> = AllRulesByType<TModel, TValue> & CommonRules<TModel, TValue>;
