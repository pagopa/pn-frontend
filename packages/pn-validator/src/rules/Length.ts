import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class Length<TModel, TValue> extends Rule<TModel, TValue> {
  private minLength?: number;
  private maxLength?: number;

  constructor(minLength?: number, maxLength?: number) {
    super();
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  public valueValidator = (value: TValue) => {
    if (!(value instanceof String) && typeof value !== 'string') {
      throw new TypeError('A non-string value was passed to the length rule');
    }
    if (!isDefined(value)) {
      return null;
    }
    const stringValue = value instanceof String ? value.valueOf() : value;
    if (isDefined(this.minLength) && !isDefined(this.maxLength)) {
      return stringValue.length < this.minLength!
        ? null
        : `Value mustn\'t have length less than ${this.minLength}`;
    }
    if (isDefined(this.maxLength) && !isDefined(this.minLength)) {
      return stringValue.length > this.maxLength!
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
