import { ValidationError } from './types/ValidationError';
import { ValidatorBuilders } from './types/ValidatorBuilders';
import { ValidatorBuilder } from './ValidatorBuilder';
import { hasError } from './HasError';
import { TypeRules } from './types/TypeRules';

/**
 * Validator options that include the strict mode but in the future you can add any other
 * options.
 */
export interface ValidatorOptions {
  strict?: boolean;
}

export class Validator<TModel> {
  private validatorBuilders: ValidatorBuilders<TModel> = {};
  private strict: boolean; // strict mode

  constructor(options: ValidatorOptions = {}) {
    this.strict = options.strict ?? false;
  }

  public readonly validate = (model: TModel): ValidationError<TModel> | null => {
    // check if the number of rule keys are equals to the number of model keys.
    if (this.strict) {
      if (typeof model === 'object' && model !== null) {
        const modelKeys = Object.keys(model);
        const ruleKeys = Object.keys(this.validatorBuilders);
        const missingKeys = modelKeys.filter((key) => !ruleKeys.includes(key));

        if (missingKeys.length > 0) {
          throw new Error(`Validation Error: Missing rules for keys: ${missingKeys.join(', ')}`);
        }
      }
    }

    // eslint-disable-next-line functional/no-let
    let errors: ValidationError<TModel> | null = null;

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
