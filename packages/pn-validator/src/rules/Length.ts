import { isString } from '../utility/IsString';
import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class Length<TModel, TValue> extends Rule<TModel, TValue> {
  private minLength?: number;
  private maxLength?: number;

  constructor(minLength?: number, maxLength?: number, customErrorMessage?: string) {
    super(customErrorMessage);
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isString(value)) {
      throw new TypeError('A non-string value was passed to the length rule');
    }
    const stringValue = value instanceof String ? value.valueOf() : value;
    if (isDefined(this.minLength) && !isDefined(this.maxLength)) {
      return stringValue.length >= this.minLength!
        ? null
        : `Value mustn\'t have length less than ${this.minLength}`;
    }
    if (isDefined(this.maxLength) && !isDefined(this.minLength)) {
      return stringValue.length <= this.maxLength!
        ? null
        : `Value mustn\'t have length greater than ${this.maxLength}`;
    }
    if (isDefined(this.minLength) && isDefined(this.maxLength)) {
      return stringValue.length >= this.minLength! && stringValue.length <= this.maxLength!
        ? null
        : `Value mustn\'t have length between ${this.minLength} and ${this.maxLength}`;
    }
    return null;
  };
}
