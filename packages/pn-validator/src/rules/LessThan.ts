import { Rule } from '../Rule';
import { isDate } from '../utility/IsDate';
import { isDefined } from '../utility/IsDefined';
import { isNumber } from '../utility/IsNumber';

export class LessThan<TModel, TValue> extends Rule<TModel, TValue> {
  private threshold: number | Date;
  private equalTo?: boolean;

  constructor(value: number | Date, equalTo?: boolean, customErrorMessage?: string) {
    super(customErrorMessage);
    this.threshold = value;
    this.equalTo = equalTo;
  }

  private compareNumber = (value: Number | number) => {
    const numberValue = value instanceof Number ? value.valueOf() : value;
    if (!isNumber(this.threshold)) {
      throw new TypeError('Threshold must be of type number');
    }
    if (this.equalTo) {
      return numberValue <= this.threshold
        ? null
        : `Value must be less than or equal to ${this.threshold}`;
    }
    return numberValue < this.threshold ? null : `Value must be less than ${this.threshold}`;
  };

  private comapreDate = (value: Date) => {
    if (!isDate(this.threshold)) {
      throw new TypeError('Threshold must be of type Date');
    }
    if (this.equalTo) {
      return value.getTime() <= this.threshold.getTime()
        ? null
        : `Value must be less than or equal to ${this.threshold.toISOString()}`;
    }
    return value.getTime() < this.threshold.getTime()
      ? null
      : `Value must be less than ${this.threshold.toISOString()}`;
  };

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isNumber(value) && !isDate(value)) {
      throw new TypeError('A value with wrong type was passed to the lessThan rule');
    }
    if (isNumber(value)) {
      return this.compareNumber(value);
    }
    if (isDate(value)) {
      return this.comapreDate(value);
    }
    return null;
  };
}
