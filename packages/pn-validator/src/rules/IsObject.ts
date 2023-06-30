import { isDefined } from '../utility/IsDefined';
import { isObject } from '../utility/IsObject';
import { Rule } from '../Rule';

export class IsObject<TModel, TValue> extends Rule<TModel, TValue> {

  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isObject(value)) {
        return 'Value must be of type object';
    }
    return null;
  };
}
