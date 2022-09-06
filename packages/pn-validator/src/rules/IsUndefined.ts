import { Rule } from "../Rule";

export class IsUndefined<TModel, TValue> extends Rule<TModel, TValue> {
    
    private not?: boolean;

    constructor(not?: boolean, customErrorMessage?: string) {
        super(customErrorMessage);
        this.not = not;
    }

    public valueValidator = (value: TValue) => {
        if (value === undefined) {
            return !this.not ? null : 'Value mustn\'t be undefined';
        }
        return !this.not ? 'Value must be undefined' : null;
    };
}