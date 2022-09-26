import { hasError } from '../HasError';

describe('Test hasError function', () => {
  it('no errors', () => {
    const result = hasError(null);
    expect(result).toBeFalsy();
  });

  it('errors (object)', () => {
    const result = hasError({a: 'a', b: 'b', c: 'c'} as any);
    expect(result).toBeTruthy();
  });

  it('errors (array)', () => {
    const result = hasError([{a: 'a'}, {b: 'b', c: 'c'}] as any);
    expect(result).toBeTruthy();
  });
});
