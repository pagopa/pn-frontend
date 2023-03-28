import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { appStateActions } from '../redux';
import { getLocalizedOrDefaultLabel } from "../services/localization.service";
import { dataRegex } from "./string.utility";

/*
 * Returns the result of "cleaning" (i.e. purging non-desired chars)
 * from a string used to denomination search, in particular in Autocomplete fields.
 */
export function searchStringCleanDenomination(wholeSearchString: string): string {
  return [...wholeSearchString.matchAll(dataRegex.denominationSearch)].map(match => match[0]).join('');
}

/*
 * The (i18n-ed) string which should be shown besides the label
 * if a search string contents has reached its limit length
 */
export function searchStringLimitReachedText(searchString: string, maxLength = 80): string {
  return searchString.length === maxLength 
    ? ` (${
          getLocalizedOrDefaultLabel(
            'common', 'validation.search-pattern-length-limit', 'max XXX caratteri', { maxLength }
          )})` 
    : '';
}

export function useSearchStringChangeInput(maxLength = 80) {
  const dispatch = useDispatch();

  return useCallback((newInputValue: string, setNewValue: (s: string) => void) => {
    const cleanedValue = searchStringCleanDenomination(newInputValue); 
    setNewValue(cleanedValue.slice(0,maxLength));
    if (cleanedValue.length < newInputValue.length) {
      const message = getLocalizedOrDefaultLabel(
        'common', 'validation.invalid-characters-not-inserted', 'caratteri invalidi non inseriti'
      );
      dispatch(appStateActions.addError({ title: message, message }));
    }
  }, [dispatch]);
};
