import { Validator } from '@pagopa-pn/pn-validator';

import { Person } from '../redux/delegation/types';
/**
 * PN-2005
 * Esempi di utilizzo della libreria pn-validator
 */
export class PersonValidator extends Validator<Person> {
  constructor() {
    super();
    this.ruleFor('firstName').isString().isEqual('Mario');
    this.ruleFor('lastName').isString().not().isEmpty();
    this.ruleFor('displayName').isString().length(3, 4);
  }
}
