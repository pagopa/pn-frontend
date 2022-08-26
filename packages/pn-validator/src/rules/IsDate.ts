import { Rule } from "../Rule";

export class IsDate<TModel, TValue> extends Rule<TModel, TValue> {
    
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