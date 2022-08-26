import { Rule } from "../Rule";

export class IsString<TModel, TValue> extends Rule<TModel, TValue> {
    
    constructor() {
        super();
    }

    public valueValidator = (value: TValue) => {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'string' || value instanceof String) {
            return null;
        }
        return 'Value must be a string';
    };
}