import { Rule } from "../Rule";

class IsObject<TModel, TValue> extends Rule<TModel, TValue> {
    
    constructor() {
        super();
    }

    public valueValidator = (value: TValue) => {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            return null;
        }
        return 'Value must be an object';
    };
}

export const isObject = new IsObject();