import { StringRuleValidator } from "../ruleValidators/StringRuleValidator";
import { CommonRules } from "./CommonRules";

export interface StringRules<TModel, TValue> extends CommonRules<TModel, TValue> {
    isEmpty: (not?: boolean) => StringRuleValidator<TModel, TValue>,
    length: (minLength?: number, maxLength?: number) => StringRuleValidator<TModel, TValue>,
    matches: (pattern: RegExp, not?: boolean) => StringRuleValidator<TModel, TValue>
}