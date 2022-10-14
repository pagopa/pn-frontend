import { Validator } from '../Validator';

class DummySubClass {
  propertyOne: string;
  propertyTwo: string;
}

class DummyClass {
  property: string;
  subProperty: DummySubClass[];
}

class SubDummyValidator extends Validator<DummySubClass> {
  constructor() {
    super();
    this.ruleFor('propertyOne').isEqual('valueOne');
    this.ruleFor('propertyTwo').isEqual('valueTwo');
  }
}

class DummyValidator extends Validator<DummyClass> {
  constructor() {
    super();

    this.ruleFor('property').isEqual('value');
    this.ruleFor('subProperty')
      .isEmpty(true)
      .forEachElement((rules) => {
        rules.setValidator(new SubDummyValidator());
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
    };
    const results = dummyValidator.validate(dummyObject);
    expect(results).toStrictEqual({
      property: 'Value must be equal to value',
      subProperty: [null, {
        propertyOne: 'Value must be equal to valueOne'
      }],
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
});
