import { ForEachElement } from './../ForEachElement';


describe('Test custom validator rule', () => {
  it('value not defined', () => {
    const rule = new ForEachElement<any, null | undefined>(() => {});
    let result = rule.valueValidator(null, null);
    expect(result).toBe(null);
    result = rule.valueValidator(undefined, null);
    expect(result).toBe(null);
  });

  it('valid value (array of string)', () => {
    const rule = new ForEachElement<any, String[]>((rules) => {
        rules.isString().isEmpty()
    });
    const result = rule.valueValidator([], null);
    expect(result).toBe(null);
  });

  it('invalid value (array of string)', () => {
    const rule = new ForEachElement<any, String[]>((rules) => {
        rules.isString().isEmpty()
    });
    const result = rule.valueValidator(['prova'], null);
    expect(result).toStrictEqual(['Value must be empty']);
  });

  it('valid value (array of object)', () => {
    class Prova {
        property: number
    }
    const rule = new ForEachElement<any, Prova[]>((rules) => {
        rules.isObject().isEqual({property: 1})
    });
    const result = rule.valueValidator([{property: 1}, {property: 1}], null);
    expect(result).toStrictEqual([null, null]);
  });

  it('invalid value (array of object)', () => {
    class Prova {
        property: number
    }
    const rule = new ForEachElement<any, Prova[]>((rules) => {
        rules.isObject().isEqual({property: 1})
    });
    const result = rule.valueValidator([{property: 1}, {property: 3}], null);
    expect(result).toStrictEqual([null, 'Value must be equal to {\"property\":1}']);
  });
});
