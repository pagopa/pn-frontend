import { hasError } from './HasError';
import { ValidatorBuilder } from './ValidatorBuilder';
import { TypeRules } from './types/TypeRules';
import { ValidationError } from './types/ValidationError';
import { ValidatorBuilders } from './types/ValidatorBuilders';
import { ValidatorOptions } from './types/ValidatorOptions';
import { isMissingRules } from './utility/isMissingRules';

export class Validator<TModel> {
  private validatorBuilders: ValidatorBuilders<TModel> = {};
  private strict: boolean; // strict mode

  constructor(options: ValidatorOptions = {}) {
    this.strict = options.strict ?? false;
  }

  public readonly validate = (model: TModel): ValidationError<TModel> | null => {
    // eslint-disable-next-line functional/no-let
    let errors: ValidationError<TModel> | null = null;

    // check if the number of rule keys are equals to the number of model keys.
    if (this.strict) {
      const missingKeys = isMissingRules(model, this.validatorBuilders);
      if (missingKeys.length > 0) {
        missingKeys.forEach((key) => {
          if (!errors) {
            errors = {};
          }
          // eslint-disable-next-line functional/immutable-data
          errors[key] = 'Rule is missing'; // Build the validation error object
        });
        return errors;
      }
    }

    // loop over all validators
    for (const propertyName of Object.keys(this.validatorBuilders)) {
      const validatorBuilder = this.validatorBuilders[propertyName as keyof TModel];
      // run validator
      if (validatorBuilder) {
        const result = validatorBuilder.validate(model[propertyName as keyof TModel], model);
        // check errors
        if (hasError(result)) {
          if (!errors) {
            errors = {};
          }
          // eslint-disable-next-line functional/immutable-data
          errors[propertyName as keyof TModel] = result;
        }
      }
    }
    return errors;
  };

  /**
   * Add rule for a specific property
   * @param  {TPropertyName} propertyName property name
   */
  public readonly ruleFor = <TPropertyName extends keyof TModel>(
    propertyName: TPropertyName
  ): TypeRules<TModel, TModel[TPropertyName]> => {
    const validatorBuilder = new ValidatorBuilder<TModel, TModel[TPropertyName]>();
    // eslint-disable-next-line functional/immutable-data
    this.validatorBuilders[propertyName] = validatorBuilder;

    return validatorBuilder.getTypeRules() as TypeRules<TModel, TModel[TPropertyName]>;
  };
}
