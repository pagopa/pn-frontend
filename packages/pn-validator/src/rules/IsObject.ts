import { Rule } from "../Rule";

export class IsObject<TModel, TValue> extends Rule<TModel, TValue> {
    
    constructor() {
        super();
    }

    public valueValidator = (value: TValue) => {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            return null;
        }
        return 'Value must be an object';
    };
}