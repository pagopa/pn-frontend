import { NumberRules } from './NumberRules';
import { StringRules } from './StringRules';
import { CommonAndDateRules } from './CombinedRules';

export type TypeRules<TModel, TValue> = {
  isString: () => StringRules<TModel, TValue>;
  isNumber: () => NumberRules<TModel, TValue>;
  isDate: () => CommonAndDateRules<TModel, TValue>;
  isObject: () => void;
  isArray: () => void;
};
