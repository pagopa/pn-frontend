import { Rule } from "../Rule";

export class IsNumber<TModel, TValue> extends Rule<TModel, TValue> {
    
    constructor() {
        super();
    }

    public valueValidator = (value: TValue) => {
        if (value === null || value === undefined) {
            return null;
        }
        if ((typeof value === 'number' || value instanceof Number) && !Number.isNaN(value)) {
            return null;
        }
        return 'Value must be a number';
    };
}