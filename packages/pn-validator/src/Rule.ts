import { ValidationResult } from './types/ValidationResult';
import { ValueValidator } from './types/ValueValidator';

export class Rule<TModel, TValue> {
  protected customErrorMessage?: string;
  protected valueValidator: ValueValidator<TModel, TValue> = () => null;

  public setCustomErrorMessage = (customErrorMessage: string): void => {
    this.customErrorMessage = customErrorMessage;
  };

  public validate = (value: TValue, model: TModel): ValidationResult<TValue> => {
    const errorOrNull = this.valueValidator(value, model);
    return errorOrNull != null ? this.customErrorMessage || errorOrNull : null;
  };
}
