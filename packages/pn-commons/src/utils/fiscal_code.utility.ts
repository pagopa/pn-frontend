/**
 * Returns the input fiscal code formatted as required by API.
 * @param  {string} fiscalCode
 * @returns string
 */
export function formatFiscalCode(fiscalCode: string): string {
  return fiscalCode.toUpperCase();
}

/** Italian Fiscal Code regex for form validation */
export const fiscalCodeRegex =
  /^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$/i;