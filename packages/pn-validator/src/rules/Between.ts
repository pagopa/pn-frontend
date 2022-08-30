import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class Between<TModel, TValue> extends Rule<TModel, TValue> {
  private lowerBound: number;
  private upperBound: number;
  private inclusiveLowerBound?: boolean;
  private inclusiveUpperBound?: boolean;

  constructor(
    lowerBound: number,
    upperBound: number,
    inclusiveLowerBound?: boolean,
    inclusiveUpperBound?: boolean
  ) {
    super();
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.inclusiveLowerBound = inclusiveLowerBound;
    this.inclusiveUpperBound = inclusiveUpperBound;
  }

  public valueValidator = (value: TValue) => {
    if (!(value instanceof Number) && typeof value !== 'number') {
      throw new TypeError('A non-number value was passed to the betwen rule');
    }
    if (!isDefined(value)) {
      return null;
    }
    const numberValue = value instanceof Number ? value.valueOf() : value;
    if (this.inclusiveLowerBound && !this.inclusiveUpperBound) {
      return numberValue >= this.lowerBound && numberValue < this.upperBound
        ? null
        : `Value must be between ${this.lowerBound} and ${this.upperBound} (inclusive lower bound)`;
    }
    if (!this.inclusiveLowerBound && this.inclusiveUpperBound) {
      return numberValue > this.lowerBound && numberValue <= this.upperBound
        ? null
        : `Value must be between ${this.lowerBound} and ${this.upperBound} (inclusive upper bound)`;
    }
    if (this.inclusiveLowerBound && this.inclusiveUpperBound) {
      return numberValue >= this.lowerBound && numberValue <= this.upperBound
        ? null
        : `Value must be between ${this.lowerBound} and ${this.upperBound} (inclusive)`;
    }
    return numberValue > this.lowerBound && numberValue < this.upperBound
      ? null
      : `Value must be between ${this.lowerBound} and ${this.upperBound} (exclusive)`;
  };
}
