import { NumberRuleValidator } from './../ruleValidators/NumberRuleValidator';
import { StringRuleValidator } from './../ruleValidators/StringRuleValidator';

export type TypeRules<TModel, TValue> = {
  isString: () => StringRuleValidator<TModel, TValue>;
  isNumber: () => NumberRuleValidator<TModel, TValue>;
  isDate: () => void;
  isObject: () => void;
  isArray: () => void;
};
