import { IsEqual } from "../rules/IsEqual";
import { IsNull } from "../rules/IsNull";
import { IsUndefined } from "../rules/IsUndefined";
import { Rule } from "../Rule";

export abstract class CommonRuleValidator<TModel, TValue> {

    protected pushRule: (rule: Rule<TModel, TValue>) => void;

    constructor(pushRule: (rule: Rule<TModel, TValue>) => void) {
        this.pushRule = pushRule;
    }

    public isNull = (not?: boolean) => {
        this.pushRule(new IsNull<TModel, TValue>(not));
        return this;
    }
    
    public isUndefined = (not?: boolean) => {
        this.pushRule(new IsUndefined<TModel, TValue>(not));
        return this;
    }

    public isEqual = (value: TValue, not?: boolean) => {
        this.pushRule(new IsEqual<TModel, TValue>(value, not));
        return this;
    }
}