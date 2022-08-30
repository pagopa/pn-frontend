import { ValidationResult } from "../types/ValidationResult";
import { Rule } from "../Rule";
import { Validator } from "../Validator";

export class InnerValidator<TModel, TValue> extends Rule<TModel, TValue> {

    private validator: Validator<TValue>
    
    constructor(validator: Validator<TValue>) {
        super();
        this.validator = validator;
    }

    public valueValidator = (value: TValue) => {
        if (value === null || value === undefined) {
            return null;
        }
        return this.validator.validate(value) as ValidationResult<TValue>;
    };
}