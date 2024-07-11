import { Rule } from '../Rule';
import { isDefined } from '../utility/IsDefined';

export class Required<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(customErrorMessage?: string) {
    super(customErrorMessage);
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return 'Value is required';
    }
    return null;
  };
}
