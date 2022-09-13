import { Validator } from '@pagopa-pn/pn-validator';

import { Person } from '../redux/delegation/types';

export class PersonValidator extends Validator<Person> {
    constructor() {
      super();
      this.ruleFor('firstName').isEqual('Mario');
      this.ruleFor('lastName').isEmpty(true);
    }
  }
  