import { Validator } from '@pagopa-pn/pn-validator';

import { CreateDelegationProps } from '../redux/delegation/types';
import { PersonValidator } from './PersonValidator';

class CreateDelegationValidator extends Validator<CreateDelegationProps> {
  constructor() {
    super();
    this.ruleFor('delegate').setValidator(new PersonValidator());
  }
}

export const createDelegationValidator = new CreateDelegationValidator();
