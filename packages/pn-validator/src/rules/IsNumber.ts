import { isDefined } from '../utility/IsDefined';
import { isNumber } from '../utility/IsNumber';
import { Rule } from '../Rule';

export class IsNumber<TModel, TValue> extends Rule<TModel, TValue> {

  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (!isNumber(value)) {
        return 'Value must be of type number';
    }
    return null;
  };
}
