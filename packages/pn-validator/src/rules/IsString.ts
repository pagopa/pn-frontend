import { isDefined } from '../utility/IsDefined';
import { isString } from '../utility/IsString';
import { Rule } from '../Rule';

export class IsString<TModel, TValue> extends Rule<TModel, TValue> {

  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isString(value)) {
        return 'Value must be of type string';
    }
    return null;
  };
}
