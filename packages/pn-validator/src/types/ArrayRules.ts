import { ArrayRuleValidator } from "../ruleValidators/ArrayRuleValidator";
import { CommonRules } from "./CommonRules";
import { TypeRules } from "./TypeRules";

export type TElemValue<T> = T extends Array<infer U> ? U : T;

export interface ArrayRules<TModel, TValue> extends CommonRules<TModel, TValue> {
    isEmpty: (not?: boolean) => ArrayRuleValidator<TModel, TValue>,
    forEachElement: (elementValidator: (availableRules: TypeRules<TModel, TElemValue<TValue>>) => void) => ArrayRuleValidator<TModel, TValue>
}