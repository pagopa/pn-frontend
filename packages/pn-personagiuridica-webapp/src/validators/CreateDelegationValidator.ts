import { Validator } from '@pagopa-pn/pn-validator';

import { CreateDelegationProps } from '../redux/delegation/types';
import { PersonValidator } from './PersonValidator';
/**
 * PN-2005
 * Esempi di utilizzo della libreria pn-validator 
 */
class CreateDelegationValidator extends Validator<CreateDelegationProps> {
  constructor() {
    super();
    this.ruleFor('delegate').isObject().setValidator(new PersonValidator());
  }
}

export const createDelegationValidator = new CreateDelegationValidator();
