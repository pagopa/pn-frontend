import { StringRules } from '../types/StringRules';
import { IsEmpty } from '../rules/isEmpty';
import { Length } from '../rules/Length';
import { Matches } from '../rules/Matches';
import { Rule } from '../Rule';
import { CommonRuleValidator } from './CommonRuleValidator';

export class StringRuleValidator<TModel, TValue>
  extends CommonRuleValidator<TModel, TValue>
  implements StringRules<TModel, TValue>
{
  constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
    super(pushRule);
  }

  isEmpty = (not?: boolean): StringRuleValidator<TModel, TValue>  => {
    this.pushRule(new IsEmpty<TModel, TValue>(not));
    return this;
  };

  length = (minLength?: number, maxLength?: number): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new Length<TModel, TValue>(minLength, maxLength));
    return this;
  };

  matches = (pattern: RegExp, not?: boolean): StringRuleValidator<TModel, TValue> => {
    this.pushRule(new Matches<TModel, TValue>(pattern, not));
    return this;
  };
}
