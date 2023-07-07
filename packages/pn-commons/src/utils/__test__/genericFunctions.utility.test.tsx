import React from 'react';
import { DisableFormatDetection, filtersApplied, getValidValue, sortArray } from '../genericFunctions.utility';
import { render } from '../../../../pn-pa-webapp/src/__test__/test-utils';

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

describe('filtersApplied function', () => {
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

describe('sortArray function', () => {
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

describe('disableFormatDetection function', () => {
  it('linkable text', () => {
    const mockText = 'mocked text +393200000000?';
    const result = render(<DisableFormatDetection param={mockText}/>);
    expect(result.container.innerHTML.toString()).toStrictEqual("mocked text <span>+</span><span>3</span><span>9</span><span>3</span><span>2</span><span>0</span><span>0</span><span>0</span><span>0</span><span>0</span><span>0</span><span>0</span><span>0</span>?");
  });
});