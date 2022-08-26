import { Rule } from "../Rule";

export class IsArray<TModel, TValue> extends Rule<TModel, TValue> {
    
    constructor() {
        super();
    }

    public valueValidator = (value: TValue) => {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'object' && Array.isArray(value)) {
            return null;
        }
        return 'Value must be an array';
    };
}