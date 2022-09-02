import { isString } from '../utility/IsString';
import { Rule } from '../Rule';

export class Matches<TModel, TValue> extends Rule<TModel, TValue> {
  private pattern: RegExp;
  private not?: boolean;

  constructor(pattern: RegExp, not?: boolean) {
    super();
    this.pattern = pattern;
    this.not = not;
  }

  public valueValidator = (value: TValue) => {
    if (value === null || value === undefined) {
      return null;
    }
    if (!isString<unknown, String>(value)) {
      throw new TypeError('A non-string value was passed to the matches rule');
    }
    const stringValue = value instanceof String ? value.valueOf() : value;
    if (this.pattern.test(stringValue)) {
      return !this.not ? null : 'Value does not match the required pattern';
    }
    return !this.not ? 'Value does match the forbidden pattern' : null;
  };
}
