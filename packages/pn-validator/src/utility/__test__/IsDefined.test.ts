import { isDefined } from '../IsDefined';

describe('Test isDefined utility function', () => {
  it('value not defined', () => {
    let result = isDefined(null);
    expect(result).toBeFalsy();
    result = isDefined(undefined);
    expect(result).toBeFalsy();
  });

  it('value defined', () => {
    const result = isDefined(1);
    expect(result).toBeTruthy();
  });
});
