/**
 * NB I changed searchStringCleanDenomination implementation because matchAll is part of the ECMAScript 2020
 * and at this date (30/03/2023) our compiler target does not include
 */
export declare function searchStringCleanDenomination(wholeSearchString: string): string;
export declare function searchStringLimitReachedText(searchString: string, maxLength?: number): string;
/**
 * This hook returns a function that can be used to handle changes to a search string input field.
 *
 * @param {number} [maxLength=80] - The maximum length for the cleaned search string.
 * @returns {(newInputValue: string, setNewValue: (s: string) => void) => void} A function that takes the new input value and a setter function for the input field value.
 */
export declare function useSearchStringChangeInput(maxLength?: number): (newInputValue: string, setNewValue: (s: string) => void) => void;
