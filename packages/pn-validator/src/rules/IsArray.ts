import { isDefined } from '../utility/IsDefined';
import { isArray } from '../utility/IsArray';
import { Rule } from '../Rule';

export class IsArray<TModel, TValue> extends Rule<TModel, TValue> {

  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isArray(value)) {
        return 'Value must be of type array';
    }
    return null;
  };
}
