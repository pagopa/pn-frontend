import { isDefined } from '../utility/IsDefined';
import { Rule } from '../Rule';

export class IsOneOf<TModel, TValue> extends Rule<TModel, TValue> {
  private possibleValues: TValue[];
  private not?: boolean;

  constructor(possibleValues: TValue[], not?: boolean, customErrorMessage?: string) {
    super(customErrorMessage);
    this.possibleValues = possibleValues;
    this.not = not;
  }

  public valueValidator = (value: TValue) => {
    if (!isDefined(value)) {
      return null;
    }
    if (this.possibleValues.includes(value)) {
      return this.not ? 'Value is included in the forbidden set' : null;
    } else {
      return this.not ? null : 'Value is not included in the expected set';
    }
  };
}
