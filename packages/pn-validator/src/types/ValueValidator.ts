import { ValidationResult } from "./ValidationResult";

export type ValueValidator<TModel, TValue> = (
    value: TValue,
    model: TModel
  ) => ValidationResult<TValue>;