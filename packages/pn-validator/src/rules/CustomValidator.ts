import { ValidationResult } from "../types/ValidationResult";
import { Rule } from "../Rule";

export class CustomValidator<TModel, TValue> extends Rule<TModel, TValue> {

    private validator: (value: TValue, model: TModel) => ValidationResult<TValue>;
    
    constructor(validator: (value: TValue, model: TModel) => ValidationResult<TValue>) {
        super();
        this.validator = validator;
    }

    public valueValidator = (value: TValue, model: TModel) => this.validator(value, model);
}