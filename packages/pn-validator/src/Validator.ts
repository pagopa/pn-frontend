import { ValidationError } from './types/ValidationError';
import { ValidatorBuilders } from './types/ValidatorBuilders';
import { ValidatorBuilder } from './ValidatorBuilder';
import { hasError } from './HasError';
import { TypeRules } from './types/TypeRules';

export class Validator<TModel> {
  private validatorBuilders: ValidatorBuilders<TModel> = {};

  public validate = (model: TModel): ValidationError<TModel> => {
    const errors: ValidationError<TModel> = {};
    // loop over all validators
    for (const propertyName of Object.keys(this.validatorBuilders)) {
      const validatorBuilder = this.validatorBuilders[propertyName as keyof TModel];
      // run validator
      if (validatorBuilder) {
        const result = validatorBuilder.validate(model[propertyName as keyof TModel], model);
        // check errors
        if (hasError(result)) {
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
  protected ruleFor = <TPropertyName extends keyof TModel, TValue extends TModel[TPropertyName]>(
    propertyName: TPropertyName
  ): TypeRules<TModel, TValue> => {
    const validatorBuilder = new ValidatorBuilder<TModel, TValue>();
    this.validatorBuilders[propertyName] = validatorBuilder as any;

    return validatorBuilder.getTypeRules() as unknown as TypeRules<TModel, TValue>;
  };
}
