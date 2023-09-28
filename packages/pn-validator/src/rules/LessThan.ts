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
    const thresholdAsNumber = this.threshold as number;
    if (this.equalTo) {
      return numberValue <= thresholdAsNumber
        ? null
        : `Value must be less than or equal to ${this.threshold}`;
    }
    return numberValue < thresholdAsNumber ? null : `Value must be less than ${this.threshold}`;
  };

  private comapreDate = (value: Date) => {
    if (this.equalTo) {
      return value.getTime() <= (this.threshold as Date).getTime()
        ? null
        : `Value must be less than or equal to ${(this.threshold as Date).toISOString()}`;
    }
    return value.getTime() < (this.threshold as Date).getTime()
      ? null
      : `Value must be less than ${(this.threshold as Date).toISOString()}`;
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
