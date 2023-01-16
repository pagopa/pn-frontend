import { isString } from '../utility/IsString';
import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class Matches<TModel, TValue> extends Rule<TModel, TValue> {
  private pattern: RegExp;
  private not?: boolean;

  constructor(pattern: RegExp, not?: boolean, customErrorMessage?: string) {
    super(customErrorMessage);
    this.pattern = pattern;
    this.not = not;
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isString(value)) {
      throw new TypeError('A non-string value was passed to the matches rule');
    }
    const stringValue = value instanceof String ? value.valueOf() : value;
    if (stringValue.match(this.pattern)) {
      return !this.not ? null : 'Value matches the forbidden pattern';
    }
    return !this.not ? 'Value doesn\'t match the required pattern' : null;
  };
}
