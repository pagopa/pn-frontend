import { ValidatorBuilder } from '../ValidatorBuilder';

const checkCommonRules = (rules) => {
  expect(rules.isNull).toBeDefined();
  expect(rules.isUndefined).toBeDefined();
  expect(rules.isEqual).toBeDefined();
  expect(rules.customValidator).toBeDefined();
}

describe('Test ValidatorBuilder', () => {
  it('check if methods exist', () => {
    const dummyValidatorBuilder = new ValidatorBuilder();
    expect(dummyValidatorBuilder.getTypeRules).toBeDefined();
    expect(dummyValidatorBuilder.validate).toBeDefined();
  });

  it('check if getTypeRules returns correct rules (string)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isEmpty).toBeDefined();
    expect(rules.length).toBeDefined();
    expect(rules.matches).toBeDefined();
    checkCommonRules(rules);
  });

  it('check if getTypeRules returns correct rules (number)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, Number>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.lessThan).toBeDefined();
    expect(rules.greaterThan).toBeDefined();
    expect(rules.between).toBeDefined();
    checkCommonRules(rules);
  });

  it('check if getTypeRules returns correct rules (number)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, Date>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.lessThan).toBeDefined();
    expect(rules.greaterThan).toBeDefined();
    checkCommonRules(rules);
  });

  it('check if getTypeRules returns correct rules (object)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, object>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isEmpty).toBeDefined();
    expect(rules.setValidator).toBeDefined();
    checkCommonRules(rules);
  });

  it('check if getTypeRules returns correct rules (array)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, Array<any>>();
    const rules = dummyValidatorBuilder.getTypeRules();
    expect(rules.isEmpty).toBeDefined();
    expect(rules.forEachElement).toBeDefined();
    checkCommonRules(rules);
  });

  it('check if validate works (value valid)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    rules.isEqual('prova');
    const results = dummyValidatorBuilder.validate('prova', {});
    expect(results).toBeNull()
  });

  it('check if validate works (value invalid)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    rules.isEqual('prova');
    const results = dummyValidatorBuilder.validate('no match', {});
    expect(results).toBe('Value must be equal to prova');
  });

  it('check if validate works (value invalid and custom error message)', () => {
    const dummyValidatorBuilder = new ValidatorBuilder<any, String>();
    const rules = dummyValidatorBuilder.getTypeRules();
    rules.isEqual('prova', false, 'Custom error message');
    const results = dummyValidatorBuilder.validate('no match', {});
    expect(results).toBe('Custom error message');
  });
});
