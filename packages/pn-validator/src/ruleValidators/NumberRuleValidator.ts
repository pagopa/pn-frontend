import { NumberRules } from '../types/NumberRules';
import { Rule } from '../Rule';
import { CommonRuleValidator } from './CommonRuleValidator';

export class NumberRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements NumberRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  lessThan = (value: number): NumberRuleValidator<TModel, TValue> => {
    return this;
  };

  lessThanOrEqualTo = (value: number): NumberRuleValidator<TModel, TValue> => {
    return this;
  };

  greaterThan = (value: number): NumberRuleValidator<TModel, TValue> => {
    return this;
  };

  greaterThanOrEqualTo = (value: number): NumberRuleValidator<TModel, TValue> => {
    return this;
  };

  exclusiveBetween = (
    lowerBound: number,
    upperBound: number
  ): NumberRuleValidator<TModel, TValue> => {
    return this;
  };

  inclusiveBetween = (
    lowerBound: number,
    upperBound: number
  ): NumberRuleValidator<TModel, TValue> => {
    return this;
  };
}
