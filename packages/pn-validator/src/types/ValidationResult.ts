export type ValidationResult<TValue> =
  | (TValue extends Array<infer TElemValue>
      ? Array<ValidationResult<TElemValue>> | string | null
      : TValue extends object
      ?
          | {
              [propertyName in keyof TValue]?: ValidationResult<TValue[propertyName]>;
            }
          | string
          | null
      : string | null)
  | string
  | null;
