/**
 * Returns the input fiscal code formatted as required by API.
 * @param  {string} fiscalCode
 * @returns string
 */
export function formatFiscalCode(fiscalCode: string): string {
  return fiscalCode.toUpperCase();
}
