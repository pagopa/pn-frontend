import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class LessThan<TModel, TValue> extends Rule<TModel, TValue> {
  private threshold: number;
  private equalTo?: boolean;

  constructor(value: number, equalTo?: boolean) {
    super();
    this.threshold = value;
    this.equalTo = equalTo;
  }

  public valueValidator = (value: TValue) => {
    if (!(value instanceof Number) && typeof value !== 'number') {
      throw new TypeError('A non-number value was passed to the lessThan rule');
    }
    if (!isDefined(value)) {
      return null;
    }
    const numberValue = value instanceof Number ? value.valueOf() : value;
    if (this.equalTo) {
      return numberValue <= this.threshold ? null : `Value must be less than or equal to ${this.threshold}`;
    }
    return numberValue < this.threshold ? null : `Value must be less than ${this.threshold}`;
  };
}
