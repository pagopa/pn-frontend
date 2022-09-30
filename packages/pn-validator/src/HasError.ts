import { ValidationResult } from "./types/ValidationResult";

export const hasError = <TValue>(
    validationResult: ValidationResult<TValue>
  ): boolean => {
    if (validationResult === null) {
      return false;
    }
  
    if (Array.isArray(validationResult)) {
      return (
        validationResult.filter((eachResult) => hasError(eachResult))
          .length > 0
      );
    }
  
    if (typeof validationResult === 'object') {
      return Object.keys(validationResult as object).length > 0;
    }
  
    return validationResult !== null;
  };