import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { appStateActions } from '../redux/slices/appStateSlice';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import { dataRegex } from './string.utility';

/*
 * Returns the result of "cleaning" (i.e. purging non-desired chars)
 * from a string used to denomination search, in particular in Autocomplete fields.
 */
// export function searchStringCleanDenomination(wholeSearchString: string): string {
//   let result = '';
//   let match;
//   while ((match = dataRegex.denominationSearch.exec(wholeSearchString)) !== null) {
//     result += match[0];
//   }
//   return result;
// }
/**
 * NB I changed searchStringCleanDenomination implementation because matchAll is part of the ECMAScript 2020
 * and at this date (30/03/2023) our compiler target does not include
 */
function searchStringCleanDenomination(wholeSearchString: string): string {
  return [...wholeSearchString.matchAll(dataRegex.denominationSearch)]
    .map((match) => match[0])
    .join('');
}

/*
 * The (i18n-ed) string which should be shown besides the label
 * if a search string contents has reached its limit length
 */
export function searchStringLimitReachedText(searchString: string, maxLength = 80): string {
  return searchString.length > maxLength
    ? ` (${getLocalizedOrDefaultLabel(
        'common',
        'validation.search-pattern-length-limit',
        'max XXX caratteri',
        { maxLength }
      )})`
    : '';
}

/**
 * This hook returns a function that can be used to handle changes to a search string input field.
 *
 * @param {number} [maxLength=80] - The maximum length for the cleaned search string.
 * @returns {(newInputValue: string, setNewValue: (s: string) => void) => void} A function that takes the new input value and a setter function for the input field value.
 */
export function useSearchStringChangeInput(
  maxLength: number = 80
): (newInputValue: string, setNewValue: (s: string) => void) => void {
  const dispatch = useDispatch();

  return useCallback(
    (newInputValue: string, setNewValue: (s: string) => void) => {
      const cleanedValue = searchStringCleanDenomination(newInputValue);
      setNewValue(cleanedValue.slice(0, maxLength));
      if (cleanedValue.length < newInputValue.length) {
        const message = getLocalizedOrDefaultLabel(
          'common',
          'validation.invalid-characters-not-inserted',
          'caratteri invalidi non inseriti'
        );
        dispatch(
          appStateActions.addError({
            title: message,
            message,
            showTechnicalData: false,
          })
        );
      }
    },
    [dispatch]
  );
}
