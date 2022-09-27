import { ObjectRuleValidator } from "../ruleValidators/ObjectRuleValidator";
import { Validator } from "../Validator";
import { CommonRules } from "./CommonRules";

export interface ObjectRules<TModel, TValue> extends CommonRules<TModel, TValue> {
    isEmpty: (not?: boolean) => ObjectRuleValidator<TModel, TValue>,
    setValidator: (validator: Validator<TValue>) => ObjectRuleValidator<TModel, TValue>
}