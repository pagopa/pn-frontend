import { Rule } from "../Rule";

class IsDate<TModel, TValue> extends Rule<TModel, TValue> {
    
    constructor() {
        super();
    }

    public valueValidator = (value: TValue) => {
        if (value === null || value === undefined) {
            return null;
        }
        if (value instanceof Date) {
            return null;
        }
        return 'Value must be a date';
    };
}

export const isDate = new IsDate();