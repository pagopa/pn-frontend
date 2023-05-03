import { filtersApplied, getValidValue, sortArray } from '../genericFunctions.utility';

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

  it('sorts array - number', () => {
    const arrayToSort = [{ number: 1 }, { number: 2 }, { number: 3 }];
    let sortedArray = sortArray('asc', 'number', arrayToSort);
    expect(sortedArray).toStrictEqual(arrayToSort);
    sortedArray = sortArray('desc', 'number', arrayToSort);
    expect(sortedArray).toStrictEqual([{ number: 3 }, { number: 2 }, { number: 1 }]);
  });

  it('sorts array - string', () => {
    const arrayToSort = [{ name: 'Andrea' }, { name: 'Mario' }, { name: 'Sara' }];
    let sortedArray = sortArray('asc', 'name', arrayToSort);
    expect(sortedArray).toStrictEqual(arrayToSort);
    sortedArray = sortArray('desc', 'name', arrayToSort);
    expect(sortedArray).toStrictEqual([{ name: 'Sara' }, { name: 'Mario' }, { name: 'Andrea' }]);
  });

  it('sorts array - date', () => {
    const arrayToSort = [{ date: '11/03/2022' }, { date: '21/10/2023' }, { date: '1/07/2045' }];
    let sortedArray = sortArray('asc', 'date', arrayToSort);
    expect(sortedArray).toStrictEqual(arrayToSort);
    sortedArray = sortArray('desc', 'date', arrayToSort);
    expect(sortedArray).toStrictEqual([
      { date: '1/07/2045' },
      { date: '21/10/2023' },
      { date: '11/03/2022' },
    ]);
  });
});
