import { Validator } from '../Validator';
import { ValidatorOptions } from '../types/ValidatorOptions';

class DummySubClass {
  propertyOne: string;
  propertyTwo: string;
}

class DummyClass {
  property: string;
  subProperty: DummySubClass[];
}

class SubDummyValidator extends Validator<DummySubClass> {
  constructor(options: ValidatorOptions = {}) {
    super(options);
    this.ruleFor('propertyOne').isString().isEqual('valueOne');
    this.ruleFor('propertyTwo').isString().isEqual('valueTwo');
  }
}

class DummyValidator extends Validator<DummyClass> {
  constructor(options: ValidatorOptions = {}, subOptions: ValidatorOptions = {}) {
    super(options);

    this.ruleFor('property').isString().isEqual('value');
    this.ruleFor('subProperty')
      .isArray()
      .not()
      .isEmpty()
      .forEachElement((rules) => {
        rules.isObject().setValidator(new SubDummyValidator(subOptions));
      });
  }
}

const dummyValidator = new DummyValidator();
const rootStrictDummyValidator = new DummyValidator({ strict: true });
const rootAndChildStrictDummyValidator = new DummyValidator({ strict: true }, { strict: true });

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
    };
    const results = dummyValidator.validate(dummyObject);
    expect(results).toBeNull();
  });

  it('should throw validation error for missing rules (strict on root validator)', () => {
    const dummyObject = {
      property: 'value',
      subProperty: [
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
          propertyThree: 'valueThree',
        },
      ],
      fooProperty: 'foo',
    };
    // Since a rule for 'subProperty' is missing, an error is expected
    const expectedError = {
      fooProperty: 'Rule is missing',
    };
    const results = rootStrictDummyValidator.validate(dummyObject);
    expect(results).toStrictEqual(expectedError);
  });

  it('should throw validation error for missing rules (strict on root and child validator)', () => {
    const dummyObject = {
      property: 'value',
      subProperty: [
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
          propertyThree: 'valueThree',
        },
      ],
    };
    // Since a rule for 'subProperty' is missing, an error is expected
    const expectedError = {
      subProperty: [
        {
          propertyThree: 'Rule is missing',
        },
      ],
    };
    const results = rootAndChildStrictDummyValidator.validate(dummyObject);
    expect(results).toStrictEqual(expectedError);
  });

  it('should not throw validation error for missing rules (no strict)', () => {
    const dummyObject = {
      property: 'value',
      subProperty: [
        {
          propertyOne: 'valueOne',
          propertyTwo: 'valueTwo',
          propertyThree: 'valueThree',
        },
      ],
      fooProperty: 'foo',
    };
    const validatorWithNoOptions = new DummyValidator();
    // With all rules defined correctly, there are expected to be no errors
    const results = validatorWithNoOptions.validate(dummyObject);
    expect(results).toBeNull();
  });
});
