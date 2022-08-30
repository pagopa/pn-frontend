import { IsEqual } from "../rules/IsEqual";
import { IsNull } from "../rules/IsNull";
import { IsUndefined } from "../rules/IsUndefined";
import { Rule } from "../Rule";

export abstract class CommonRuleValidator<TModel, TValue> {

    protected pushRule: (rule: Rule<TModel, TValue>) => void;

    constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
        this.pushRule = pushRule;
    }
    
    /**
     * Check if value is null
     * @param {boolean} [not] boolean to evaluate negative condition
     */
    public isNull = (not?: boolean) => {
        this.pushRule(new IsNull<TModel, TValue>(not));
        return this;
    }
    
    /**
     * Check if value is undefined
     * @param {boolean} [not] boolean to evaluate negative condition
     */
    public isUndefined = (not?: boolean) => {
        this.pushRule(new IsUndefined<TModel, TValue>(not));
        return this;
    }

    /**
     * Check if value is equal to one provided
     * @param {boolean} value value to compare
     * @param {boolean} [not] boolean to evaluate negative condition
     */
    public isEqual = (value: TValue, not?: boolean) => {
        this.pushRule(new IsEqual<TModel, TValue>(value, not));
        return this;
    }
}