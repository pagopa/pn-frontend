import { isDate } from '../utility/IsDate';
import { isDefined } from '../utility/IsDefined';
import { isNumber } from '../utility/IsNumber';
import { Rule } from '../Rule';

export class GreaterThan<TModel, TValue> extends Rule<TModel, TValue> {
  private threshold: number | Date;
  private equalTo?: boolean;

  constructor(value: number | Date, equalTo?: boolean, customErrorMessage?: string) {
    super(customErrorMessage);
    this.threshold = value;
    this.equalTo = equalTo;
  }

  private compareNumber = (value: Number | number) => {
    const numberValue = value instanceof Number ? value.valueOf() : value;
    if (this.equalTo) {
      return numberValue >= this.threshold
        ? null
        : `Value must be greater than or equal to ${this.threshold}`;
    }
    return numberValue > this.threshold ? null : `Value must be greater than ${this.threshold}`;
  };

  private compareDate = (value: Date) => {
    if (this.equalTo) {
      return value.getTime() >= (this.threshold as Date).getTime()
        ? null
        : `Value must be greater than or equal to ${(this.threshold as Date).toISOString()}`;
    }
    return value.getTime() > (this.threshold as Date).getTime()
      ? null
      : `Value must be greater than ${(this.threshold as Date).toISOString()}`;
  };

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isNumber(value) && !isDate(value)) {
      throw new TypeError('A value with wrong type was passed to the greaterThan rule');
    }
    if (isNumber(value)) {
      return this.compareNumber(value);
    }
    if (isDate(value)) {
      return this.compareDate(value);
    }
    return null;
  };
}
