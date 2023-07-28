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
  constructor(options: ValidatorOptions = {}) {
    super(options);
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

class DummyFooValidator extends Validator<DummyClass> {
  constructor(options: ValidatorOptions = {}) {
    super(options);
    this.ruleFor('property').isString().isEqual('value');
    this.ruleFor('fooProperty').isString().isEqual('foo');
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

describe('Test Validator with strict mode enabled', () => {
  const dummyObject: DummyClass = {
    property: 'value',
    subProperty: [
      {
        propertyOne: 'valueOne',
        propertyTwo: 'valueTwo',
      },
    ],
    fooProperty: 'foo',
  };

  it('should throw validation error for missing rules (strict: true)', () => {
    const validatorWithOptions = new DummyFooValidator({ strict: true });
    // Since a rule for 'subProperty' is missing, an error is expected
    const expectedError = {
      subProperty: 'Rule is missing'
    };
    const results = validatorWithOptions.validate(dummyObject);
    expect(results).toStrictEqual(expectedError);
  });

  it('should not throw validation error for missing rules (strict: false)', () => {
    const validatorWithNoOptions = new DummyValidator();
    // With all rules defined correctly, there are expected to be no errors
    const results = validatorWithNoOptions.validate(dummyObject);
    expect(results).toBeNull();
  });
});