/**
 * This is an interface for the validator options.
 * You can use this interface to provide additional options to the validator constructor.
 * @example
 * const options: ValidatorOptions = { strict: true };
 * const validator = new Validator<MyModel>(options);
 */
export interface ValidatorOptions {
    /**
     * Enable strict mode for validation.
     * If set to true, the validator will check if all the keys in the model object have a corresponding rule.
     */
    strict?: boolean;
}