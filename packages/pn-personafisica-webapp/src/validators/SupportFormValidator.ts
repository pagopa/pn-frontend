import { dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

import { SupportForm } from '../models/Support';

function makeRequired(rule: any): void {
  rule.not().isEmpty('required').not().isUndefined('required').not().isNull('required');
}

class SupportFormValidator extends Validator<SupportForm> {
  constructor() {
    super();
    makeRequired(this.ruleFor('email').isString().matches(dataRegex.email, 'not-valid'));
    makeRequired(
      this.ruleFor('confirmEmail')
        .isString()
        .matches(dataRegex.email, 'not-valid')
        .customValidator((value: string, model: SupportForm) => {
          if (value === model.email) {
            return null;
          }
          return 'not-the-same';
        })
    );
  }
}

export default new SupportFormValidator();
