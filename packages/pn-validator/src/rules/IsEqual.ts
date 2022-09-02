import { isDate } from './../utility/IsDate';
import { isArray } from './../utility/IsArray';
import { isObject } from '../utility/IsObject';
import { Rule } from '../Rule';

export class IsEqual<TModel, TValue> extends Rule<TModel, TValue> {
  private not?: boolean;
  private valueToCompare: TValue;

  constructor(value: TValue, not?: boolean) {
    super();
    this.not = not;
    this.valueToCompare = value;
  }

  private compareDate = <TArg>(value: TArg, valueToCompare: TArg): boolean => {
    if (isDate<unknown, Date>(value) && isDate<unknown, Date>(valueToCompare)) {
      return value.getTime() === valueToCompare.getTime();
    }
    return false;
  };

  private compareObject = <TPropertyName extends keyof TArg, TArg>(
    value: TArg,
    valueToCompare: TArg
  ): boolean => {
    if (isObject<unknown, object>(value) && isObject<unknown, object>(valueToCompare)) {
      if (Object.keys(value).length === Object.keys(valueToCompare).length) {
        return Object.keys(value).every((key) => {
          return (
            (valueToCompare as Object).hasOwnProperty(key) &&
            this.compare(value[key as TPropertyName], valueToCompare[key as TPropertyName])
          );
        });
      }
      return false;
    }
    return false;
  };

  private compareArray = <TArg>(value: TArg, valueToCompare: TArg): boolean => {
    if (
      isArray<unknown, Array<unknown>>(value) &&
      isArray<unknown, Array<unknown>>(valueToCompare)
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

  private compare = <TArg>(value: TArg, valueToCompare: TArg): boolean => {
    if (typeof value === typeof valueToCompare) {
      if (isObject<unknown, object>(value)) {
        return this.compareObject(value, valueToCompare);
      }
      if (isArray<unknown, Array<unknown>>(value)) {
        return this.compareArray(value, valueToCompare);
      }
      if (
        (isDate<unknown, Date>(value) && this.compareDate(value, valueToCompare)) ||
        value === valueToCompare
      ) {
        return true;
      }
    }
    return false;
  };

  private printValue = () => {
    if (isObject<unknown, object>(this.valueToCompare)) {
      return JSON.stringify(this.valueToCompare);
    }
    if (isArray<unknown, Array<unknown>>(this.valueToCompare)) {
      return this.valueToCompare.toString();
    }
    if (isDate<unknown, Date>(this.valueToCompare)) {
      return this.valueToCompare.toISOString();
    }
    return this.valueToCompare;
  };

  public valueValidator = (value: TValue) => {
    if (this.compare(value, this.valueToCompare)) {
      return !this.not ? null : `Value mustn\'t be equal to ${this.printValue()}`;
    }
    return !this.not ? `Value must be equal to ${this.printValue()}` : null;
  };
}
