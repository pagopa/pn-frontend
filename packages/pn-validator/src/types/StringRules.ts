import { CommonRules } from "./CommonRules";

export interface StringRules<TModel, TValue> extends CommonRules<TModel, TValue> {
    isEmpty: (not?: boolean) => StringRules<TModel, TValue>,
    length: (minLength?: number, maxLength?: number) => StringRules<TModel, TValue>,
    matches: (pattern: RegExp, not?: boolean) => StringRules<TModel, TValue>
}