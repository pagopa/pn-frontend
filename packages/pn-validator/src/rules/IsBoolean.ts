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
    if (value !== true && value !== false) {
        return 'Value must be of type boolean';
    }
    return null;
  };
}
