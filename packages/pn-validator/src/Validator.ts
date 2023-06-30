import { ValidationError } from './types/ValidationError';
import { ValidatorBuilders } from './types/ValidatorBuilders';
import { ValidatorBuilder } from './ValidatorBuilder';
import { hasError } from './HasError';
import { TypeRules } from './types/TypeRules';

export class Validator<TModel> {
  private validatorBuilders: ValidatorBuilders<TModel> = {};

  public readonly validate = (model: TModel): ValidationError<TModel> | null => {
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
  public readonly ruleFor = <TPropertyName extends keyof TModel, TValue extends TModel[TPropertyName]>(
    propertyName: TPropertyName
  ): TypeRules<TModel, TValue> => {
    const validatorBuilder = new ValidatorBuilder<TModel, TValue>();
    this.validatorBuilders[propertyName] = validatorBuilder as any;

    return validatorBuilder.getTypeRules() as unknown as TypeRules<TModel, TValue>;
  };
}
