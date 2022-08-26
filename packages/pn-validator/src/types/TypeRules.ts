export type TypeRules<TModel, TValue> = {
    isString: () => void,
    isNumber: () => void,
    isDate: () => void,
    isObject: () => void,
    isArray: () => void
}