import { ValidatorBuilder } from '../ValidatorBuilder';

const checkCommonRules = (rules) => {
  expect(rules.isNull).toBeDefined();
  expect(rules.isUndefined).toBeDefined();
  expect(rules.isEqual).toBeDefined();
  expect(rules.isOneOf).toBeDefined();
  expect(rules.customValidator).toBeDefined();
  expect(rules.not).toBeDefined();
  expect(rules.not().isNull).toBeDefined();
  expect(rules.not().isUndefined).toBeDefined();
  expect(rules.not().isEqual).toBeDefined();
  expect(rules.not().isOneOf).toBeDefined();
};

describe('Test ValidatorBuilder', () => {
  it('check if methods exist', () => {
    const dummyValidatorBuilder = new ValidatorBuilder();
    expect(dummyValidatorBuilder.getTypeRules).toBeDefined();
    expect(dummyValidatorBuilder.validate).toBeDefined();
  });

  it('check if getTypeRules returns correct rules (string)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isString).toBeDefined();
    expect(rules.isString().isEmpty).toBeDefined();
    expect(rules.isString().length).toBeDefined();
    expect(rules.isString().matches).toBeDefined();
    checkCommonRules(rules.isString());
    expect(rules.isString().not().isEmpty).toBeDefined();
    expect(rules.isString().not().matches).toBeDefined();
  });

  it('check if getTypeRules returns correct rules (number)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, Number>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isNumber).toBeDefined();
    expect(rules.isNumber().lessThan).toBeDefined();
    expect(rules.isNumber().greaterThan).toBeDefined();
    expect(rules.isNumber().between).toBeDefined();
    checkCommonRules(rules.isNumber());
  });

  it('check if getTypeRules returns correct rules (boolean)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, Boolean>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isBoolean).toBeDefined();
    checkCommonRules(rules.isBoolean());
  });

  it('check if getTypeRules returns correct rules (date)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, Date>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isDate).toBeDefined();
    expect(rules.isDate().lessThan).toBeDefined();
    expect(rules.isDate().greaterThan).toBeDefined();
    checkCommonRules(rules.isDate());
  });

  it('check if getTypeRules returns correct rules (object)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, object>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isObject).toBeDefined();
    expect(rules.isObject().isEmpty).toBeDefined();
    expect(rules.isObject().setValidator).toBeDefined();
    checkCommonRules(rules.isObject());
    expect(rules.isObject().not().isEmpty).toBeDefined();
  });

  it('check if getTypeRules returns correct rules (array)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, Array<any>>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isArray).toBeDefined();
    expect(rules.isArray().isEmpty).toBeDefined();
    expect(rules.isArray().forEachElement).toBeDefined();
    checkCommonRules(rules.isArray());
    expect(rules.isArray().not().isEmpty).toBeDefined();
  });

  it('check if validate works (value valid)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    rules.isString().isEqual('prova');
    const results = dummyValidatorBuilder.validate('prova', {});
    expect(results).toBeNull();
  });

  it('check if validate works (value invalid)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    rules.isString().isEqual('prova');
    const results = dummyValidatorBuilder.validate('no match', {});
    expect(results).toBe('Value must be equal to prova');
  });

  it('check if validate works (value invalid and custom error message)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    rules.isString().isEqual('prova', 'Custom error message');
    const results = dummyValidatorBuilder.validate('no match', {});
    expect(results).toBe('Custom error message');
  });
});
