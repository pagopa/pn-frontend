import { ValidationResult } from "./ValidationResult";

export type ValidationError<TModel> = {
    [propertyName in keyof TModel]?: ValidationResult<TModel[propertyName]>
}