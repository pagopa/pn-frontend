import { Rule } from "../Rule";

export class IsNull<TModel, TValue> extends Rule<TModel, TValue> {

    private not?: boolean;
    
    constructor(not?: boolean, customErrorMessage?: string) {
        super(customErrorMessage);
        this.not = not;
    }

    public valueValidator = (value: TValue) => {
        if (value === null) {
            return !this.not ? null : 'Value mustn\'t be null';
        }
        return !this.not ? 'Value must be null' : null;
    };
}