import { isDefined } from '../utility/IsDefined';
import { isDate } from '../utility/IsDate';
import { Rule } from '../Rule';

export class IsDate<TModel, TValue> extends Rule<TModel, TValue> {

  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isDate(value)) {
        return 'Value must be of type date';
    }
    return null;
  };
}
