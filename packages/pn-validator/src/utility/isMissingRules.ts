import { ValidatorBuilders } from "../types/ValidatorBuilders";
import { isObject } from "./IsObject";

/**
 * Checks for missing rules in the model object.
 *
 * @param {TModel} value The model object to check for missing rules.
 * @param {ValidatorBuilders<TModel>} validatorBuilders The validator builders containing the defined rules.
 * @returns {Array<keyof TModel>} An array of keys representing the properties that have missing rules.
 */
export const isMissingRules = <TModel>(
    value: TModel,
    validatorBuilders: ValidatorBuilders<TModel>
): Array<keyof TModel> => {
    if (isObject(value)) {
        const modelKeys = Object.keys(value);
        const ruleKeys = Object.keys(validatorBuilders);
        return modelKeys.filter((key) => !ruleKeys.includes(key)) as Array<keyof TModel>;
    }
    return [];
};
