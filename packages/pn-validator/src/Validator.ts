import { ValidationError } from './types/ValidationError';
import { ValidatorBuilders } from './types/ValidatorBuilders';
import { ValidatorBuilder } from './ValidatorBuilder';
import { hasError } from './HasError';
import { TypeRules } from './types/TypeRules';
import { ValidatorOptions } from './types/ValidatorOptions';

export class Validator<TModel> {
  private validatorBuilders: ValidatorBuilders<TModel> = {};
  private strict: boolean; // strict mode

  constructor(options: ValidatorOptions = {}) {
    this.strict = options.strict ?? false;
  }

  private hasMissingRules = (model: any, ruleBuilders: ValidatorBuilders<TModel>, path: string[] = []): string[] => {
    const missingKeys: string[] = [];

    for (const propertyName of Object.keys(model)) {
      const propertyPath = [...path, propertyName];
      const validatorBuilder = ruleBuilders[propertyName as keyof TModel];

      if (validatorBuilder === undefined) {
        missingKeys.push(propertyPath.join('.'));
      }

      const propertyValue = model[propertyName];

      if (typeof propertyValue === 'object' && propertyValue !== null) {
        if (Array.isArray(propertyValue)) {
          for (let i = 0; i < propertyValue.length; i++) {
            const itemPath = [...propertyPath, i.toString()];
            missingKeys.push(...this.hasMissingRules(propertyValue[i], ruleBuilders, itemPath));
          }
        } else {
          missingKeys.push(...this.hasMissingRules(propertyValue, ruleBuilders, propertyPath));
        }
      }
    }

    return missingKeys;
  };

  public readonly validate = (model: TModel): ValidationError<TModel> | null => {

    // check if the number of rule keys are equals to the number of model keys.
    if (this.strict) {
      if (typeof model === 'object' && model !== null) {
        const missingKeys = this.hasMissingRules(model, this.validatorBuilders);
        if (missingKeys.length > 0) {
          throw new Error(`Validation Error: Missing rules for keys: ${missingKeys.join(', ')}`);
        }
      }
    }

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
