import { Validator } from '../Validator';
import { ValidatorOptions } from '../types/ValidatorOptions';

class DummySubClass {
    propertyOne: string;
    propertyTwo: string;
  }

class DummyClass {
  property: string;
  subProperty: DummySubClass[];
  fooProperty: string;
}

class SubDummyValidator extends Validator<DummySubClass> {
  constructor() {
    super();
    this.ruleFor('propertyOne').isString().isEqual('valueOne');
    this.ruleFor('propertyTwo').isString().isEqual('valueTwo');
  }
}

class DummyValidator extends Validator<DummyClass> {
  constructor(options: ValidatorOptions = {}) {
    super(options);

    this.ruleFor('property').isString().isEqual('value');
    this.ruleFor('subProperty')
      .isArray()
      .not()
      .isEmpty()
      .forEachElement((rules) => {
        rules.isObject().setValidator(new SubDummyValidator());
      });
  }
}

const dummyValidator = new DummyValidator();

describe('Test Validator', () => {
  it('check if methods exist', () => {
    expect(dummyValidator.validate).toBeDefined();
  });

  it('check if validation works (value invalid)', () => {
    const dummyObject: DummyClass = {
      property: 'valueWrong',
      subProperty: [
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
        },
        {
          propertyOne: 'valueOneWrong',
          propertyTwo: 'valueTwo',
        },
      ],
      fooProperty: 'foo'
    };
    const results = dummyValidator.validate(dummyObject);
    expect(results).toStrictEqual({
      property: 'Value must be equal to value',
      subProperty: [
        null,
        {
          propertyOne: 'Value must be equal to valueOne',
        },
      ],
    });
  });

  it('check if validation works (value valid)', () => {
    const dummyObject: DummyClass = {
      property: 'value',
      subProperty: [
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
        },
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
        },
      ],
      fooProperty: 'foo'
    };
    const results = dummyValidator.validate(dummyObject);
    expect(results).toBeNull();
  });
});

const validatorWithOptions = new DummyValidator({ strict: true });

describe('Test Validator with strict mode enabled', () => {
  it('check if validation works with strict mode (rule missing)', () => {
    const dummyObject: DummyClass = {
      property: 'value',
      subProperty: [
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
        },
      ],
      fooProperty: 'foo'
    };
    // Since a rule for 'fooProperty' is missing, an error is expected
    expect(() => validatorWithOptions.validate(dummyObject)).toThrowError(
      'Validation Error: Missing rules for keys: subProperty.0.propertyOne, subProperty.0.propertyTwo, fooProperty'
    );
  });

  const validatorWithNoOptions = new DummyValidator();

  it('check if validation works with strict mode (valid)', () => {
    const dummyObject: DummyClass = {
      property: 'value',
      subProperty: [
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
        },
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
        },
      ],
      fooProperty: 'foo'
    };
    // With all rules defined correctly, there are expected to be no errors
    const results = validatorWithNoOptions.validate(dummyObject);
    expect(results).toBeNull();
  });
});
