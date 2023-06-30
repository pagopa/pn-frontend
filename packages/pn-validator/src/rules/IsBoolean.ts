import { isBoolean } from './../utility/IsBoolean';
import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class IsBoolean<TModel, TValue> extends Rule<TModel, TValue> {

  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isBoolean(value)) {
        return 'Value must be of type boolean';
    }
    return null;
  };
}
