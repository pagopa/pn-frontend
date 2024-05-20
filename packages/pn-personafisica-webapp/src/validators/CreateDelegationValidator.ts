import { Validator } from '@pagopa-pn/pn-validator';

import { NewMandateRequest } from '../redux/delegation/types';
import { PersonValidator } from './PersonValidator';

/**
 * PN-2005
 * Esempi di utilizzo della libreria pn-validator
 */
class CreateDelegationValidator extends Validator<NewMandateRequest> {
  constructor() {
    super();
    this.ruleFor('delegate').isObject().setValidator(new PersonValidator());
  }
}

export const createDelegationValidator = new CreateDelegationValidator();
