import { Validator } from '@pagopa-pn/pn-validator';

import { CreateDelegationProps, Person } from '../redux/delegation/types';

class PersonValidator extends Validator<Person> {
  constructor() {
    super();
    this.ruleFor('firstName').isEqual('Mario');
    this.ruleFor('lastName').isEmpty(true);
  }
}

class CreateDelegationValidator extends Validator<CreateDelegationProps> {
  constructor() {
    super();
    this.ruleFor('delegate').setValidator(new PersonValidator());
  }
}

export const createDelegationValidator = new CreateDelegationValidator();
