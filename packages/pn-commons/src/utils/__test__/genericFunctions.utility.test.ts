import { getValidValue } from '../genericFunctions.utility';

describe('getValidValue function', () => {
  it('return A value', () => {
    const valueA = 'mock-value-a';
    expect(getValidValue(valueA)).toBe('mock-value-a');
  });

  it('return B value', () => {
    const valueA = '';
    const valueB = 'mock-value-b';
    expect(getValidValue(valueA, valueB)).toBe('mock-value-b');
  });

  it('return undefined value', () => {
    const valueA = '';
    const valueB = undefined;
    expect(getValidValue(valueA, valueB)).toBe('');
  });
});
