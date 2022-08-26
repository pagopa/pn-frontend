import { AllRules } from './CombinedRules';

export interface CommonRules<TModel, TValue> {
    isNull: (not?: boolean) => AllRules<TModel, TValue>,
    isUndefined: (not?: boolean) => AllRules<TModel, TValue>,
    isEqual: (value: TValue, not?: boolean) => AllRules<TModel, TValue>
}