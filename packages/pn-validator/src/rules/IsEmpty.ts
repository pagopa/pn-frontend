import { isArray } from '../utility/IsArray';
import { isDefined } from '../utility/IsDefined';
import { isObject } from '../utility/IsObject';
import { Rule } from '../Rule';

export class IsEmpty<TModel, TValue> extends Rule<TModel, TValue> {
  private not?: boolean;

  constructor(not?: boolean, customErrorMessage?: string) {
    super(customErrorMessage);
    this.not = not;
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
        return null;
    }
    if ((typeof value === 'string') && value === '') {
        return !this.not ? null : 'Value mustn\'t be empty';
    }
    if (value instanceof String && value.valueOf() === '') {
        return !this.not ? null : 'Value mustn\'t be empty';
    }
    if (isObject(value) && Object.keys(value).length === 0) {
        return !this.not ? null : 'Value mustn\'t be empty';
    }
    if (isArray(value) && value.length === 0) {
        return !this.not ? null : 'Value mustn\'t be empty';
    }

    return !this.not ? 'Value must be empty' : null;
  };
}
