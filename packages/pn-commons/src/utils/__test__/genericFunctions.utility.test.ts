import { filtersApplied, getValidValue } from '../genericFunctions.utility';

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

  it('return filters count (no filters)', () => {
    const count = filtersApplied(
      {
        username: '',
        email: '',
      },
      {
        username: '',
        email: '',
      }
    );
    expect(count).toEqual(0);
  });

  it('return filters count (with filters)', () => {
    const count = filtersApplied(
      {
        username: '',
        email: '',
      },
      {
        username: 'mariorossi',
        email: 'mario.rossi@mail.it',
      }
    );
    expect(count).toEqual(2);
  });
});
