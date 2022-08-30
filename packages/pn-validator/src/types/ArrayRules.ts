import { ArrayRuleValidator } from "../ruleValidators/ArrayRuleValidator";
import { CommonRules } from "./CommonRules";

export interface ArrayRules<TModel, TValue> extends CommonRules<TModel, TValue> {
    isEmpty: (not?: boolean) => ArrayRuleValidator<TModel, TValue>,
}