import { Validator } from '@pagopa-pn/pn-validator';

export interface Person {
  firstName?: string;
  lastName?: string;
  displayName: string;
  companyName?: string;
  fiscalCode?: string;
}

export class PersonValidator extends Validator<Person> {
  constructor() {
    super();
    this.ruleFor('firstName').isString().isEqual('Mario');
    this.ruleFor('lastName').isString().not().isEmpty();
    this.ruleFor('displayName').isString().length(3, 4);
  }
}
