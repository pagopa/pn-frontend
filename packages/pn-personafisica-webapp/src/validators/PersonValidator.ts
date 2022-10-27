import { Validator } from '@pagopa-pn/pn-validator';

import { Person } from '../redux/delegation/types';
/**
 * PN-2005
 * Esempi di utilizzo della libreria pn-validator 
 */
export class PersonValidator extends Validator<Person> {
    constructor() {
      super();
      this.ruleFor('firstName').isEqual('Mario');
      this.ruleFor('lastName').isEmpty();
      this.ruleFor('displayName').length(3, 4);
    }
  }
  