import { InnerValidator } from '../InnerValidator';
import { Validator } from './../../Validator';

class Prova {
  property: string;

  constructor(property: string) {
    this.property = property;
  }
}

class ProvaValidator extends Validator<Prova> {
  constructor() {
    super();
    this.ruleFor('property').isString().isEmpty();
  }
}

const rule = new InnerValidator<any, Prova>(new ProvaValidator());

describe('Test inner validator rule', () => {
  it('value not pass inner validation', () => {
    const result = rule.valueValidator({ property: 'prova' });
    expect(result).toStrictEqual({ property: 'Value must be empty' });
  });

  it('value pass inner validation', () => {
    const result = rule.valueValidator({ property: '' });
    expect(result).toBe(null);
  });
});
