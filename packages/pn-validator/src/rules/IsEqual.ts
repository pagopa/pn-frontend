import { Rule } from '../Rule';

export class IsEqual<TModel, TValue> extends Rule<TModel, TValue> {
  private not?: boolean;
  private valueToCompare: TValue;

  constructor(value: TValue, not?: boolean) {
    super();
    this.not = not;
    this.valueToCompare = value;
  }

  private compareDate = (value: TValue, valueToCompare: TValue): boolean => {
    if (value instanceof Date && valueToCompare instanceof Date) {
      return value.getTime() === valueToCompare.getTime();
    }
    return false;
  };

  private compareObject = (value: TValue, valueToCompare: TValue): boolean => {
    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof valueToCompare === 'object' &&
      !Array.isArray(valueToCompare)
    ) {
      if (Object.keys(value).length === Object.keys(valueToCompare).length) {
        return Object.keys(value).every((key) => {
          return (valueToCompare as Object).hasOwnProperty(key) && this.compare(value[key], valueToCompare[key]);
        });
      }
      return false;
    }
    return false;
  };

  private compareArray = (value: TValue, valueToCompare: TValue): boolean => {
    if (
      typeof value === 'object' &&
      Array.isArray(value) &&
      typeof valueToCompare === 'object' &&
      Array.isArray(valueToCompare)
    ) {
      if (value.length === valueToCompare.length) {
        return value.every((elem, index) => {
          return this.compare(elem, valueToCompare[index]);
        });
      }
      return false;
    }
    return false;
  };

  private compare = (value: TValue, valueToCompare: TValue): boolean => {
    if (typeof value === typeof valueToCompare) {
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && value !== null) {
        return this.compareObject(value, valueToCompare);
      }
      if (typeof value === 'object' && Array.isArray(value) && value !== null) {
          return this.compareArray(value, valueToCompare);
      }
      if ((value instanceof Date && this.compareDate(value, valueToCompare)) || value === valueToCompare) {
          return true;
      }
    }
    return false;
  };

  public valueValidator = (value: TValue) => {
    if (this.compare(value, this.valueToCompare)) {
        return !this.not ? null : 'Value mustn\'t be equal';
    }
    return !this.not ? 'Value must be equal' : null;
  };
}
