import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class GreaterThan<TModel, TValue> extends Rule<TModel, TValue> {
  private threshold: number | Date;
  private equalTo?: boolean;

  constructor(value: number | Date, equalTo?: boolean) {
    super();
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

  private comapreDate = (value: Date) => {
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
    if (!(value instanceof Number) && typeof value !== 'number' && !(value instanceof Date)) {
      throw new TypeError('A value with wrong type was passed to the greaterThan rule');
    }
    if (!isDefined(value)) {
      return null;
    }
    if (value instanceof Number || typeof value === 'number') {
      return this.compareNumber(value);
    }
    if (value instanceof Date) {
      return this.comapreDate(value);
    }
    return null;
  };
}
