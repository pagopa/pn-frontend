import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class GreaterThan<TModel, TValue> extends Rule<TModel, TValue> {
  private threshold: number;
  private equalTo?: boolean;

  constructor(value: number, equalTo?: boolean) {
    super();
    this.threshold = value;
    this.equalTo = equalTo;
  }

  public valueValidator = (value: TValue) => {
    if (!(value instanceof Number) && typeof value !== 'number') {
      throw new TypeError('A non-number value was passed to the greaterThan rule');
    }
    if (!isDefined(value)) {
      return null;
    }
    const numberValue = value instanceof Number ? value.valueOf() : value;
    if (this.equalTo) {
      return numberValue >= this.threshold ? null : `Value must be greater than or equal to ${this.threshold}`;
    }
    return numberValue > this.threshold ? null : `Value must be greater than ${this.threshold}`;
  };
}
