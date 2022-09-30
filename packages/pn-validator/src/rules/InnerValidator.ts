import { ValidationResult } from "../types/ValidationResult";
import { isDefined } from "../utility/IsDefined";
import { Rule } from "../Rule";
import { Validator } from "../Validator";

export class InnerValidator<TModel, TValue> extends Rule<TModel, TValue> {

    private validator: Validator<TValue>
    
    constructor(validator: Validator<TValue>) {
        super();
        this.validator = validator;
    }

    public valueValidator = (value: TValue) => {
        if (!isDefined(value)) {
            return null;
        }
        const result = this.validator.validate(value);
        if (result && Object.keys(result).length > 0) {
            return result as ValidationResult<TValue>;
        }
        return null;
    };
}