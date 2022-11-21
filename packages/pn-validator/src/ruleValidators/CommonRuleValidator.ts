import { IsEqual } from "../rules/IsEqual";
import { IsNull } from "../rules/IsNull";
import { IsUndefined } from "../rules/IsUndefined";
import { CustomValidator } from "../rules/CustomValidator";
import { ValidationResult } from "../types/ValidationResult";
import { Rule } from "../Rule";
import { IsOneOf } from "../rules/IsOneOf";

export abstract class CommonRuleValidator<TModel, TValue> {

    protected pushRule: (rule: Rule<TModel, TValue>) => void;

    constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
        this.pushRule = pushRule;
    }
    
    /**
     * Check if value is null
     * @param {boolean} [not] boolean to evaluate negative condition
     * @param {string} [customErrorMessage] custom message to show when validation fails
     */
    public isNull = (not?: boolean, customErrorMessage?: string) => {
        this.pushRule(new IsNull<TModel, TValue>(not, customErrorMessage));
        return this;
    }
    
    /**
     * Check if value is undefined
     * @param {boolean} [not] boolean to evaluate negative condition
     * @param {string} [customErrorMessage] custom message to show when validation fails
     */
    public isUndefined = (not?: boolean, customErrorMessage?: string) => {
        this.pushRule(new IsUndefined<TModel, TValue>(not, customErrorMessage));
        return this;
    }

    /**
     * Check if value is equal to one provided
     * @param {boolean} value value to compare
     * @param {boolean} [not] boolean to evaluate negative condition
     * @param {string} [customErrorMessage] custom message to show when validation fails
     */
    public isEqual = (value: TValue, not?: boolean, customErrorMessage?: string) => {
        this.pushRule(new IsEqual<TModel, TValue>(value, not, customErrorMessage));
        return this;
    }

    /**
     * Check if value is in (not in) the set provided
     * @param {TValue[]} value value to compare
     * @param {boolean} [not] boolean to evaluate negative condition
     * @param {string} [customErrorMessage] custom message to show when validation fails
     */
     public isOneOf = (possibleValues: TValue[], not?: boolean, customErrorMessage?: string) => {
        this.pushRule(new IsOneOf<TModel, TValue>(possibleValues, not, customErrorMessage));
        return this;
    }

    /**
     * Run custom validator
     * @param {boolean} validator custom validator
     */
     public customValidator = (validator: (value: TValue, model: TModel) => ValidationResult<TValue>) => {
        this.pushRule(new CustomValidator<TModel, TValue>(validator));
        return this;
    }
}