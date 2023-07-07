import _ from 'lodash';
import React from 'react';
import { formatFromString } from './date.utility';
import { dataRegex } from './string.utility';

export function getValidValue(a: string | number | undefined, b?: string | number): any {
  return a || (b ? b : '');
}

/**
 * Returns the number of filters applied
 * @param  prevFilters TFilters
 * @param  emptyValues TFilters
 * @returns number
 */
export function filtersApplied<TFilters extends object>(
  prevFilters: TFilters,
  emptyValues: TFilters
): number {
  return Object.entries(prevFilters).reduce((c: number, element: [string, any]) => {
    if (element[0] in emptyValues && !_.isEqual(element[1], (emptyValues as any)[element[0]])) {
      return c + 1;
    }
    return c;
  }, 0);
}

/**
 * Sorts an array of object
 * @template TArray
 * @param {('desc' | 'asc')} order descending or ascending order
 * @param {keyof TArray} sortAttr attribute on witch order
 * @param {Array<TArray>} values array to order
 * @returns array
 */
export function sortArray<TArray>(
  order: 'desc' | 'asc',
  sortAttr: keyof TArray,
  values: Array<TArray>
) {
  /* eslint-disable functional/immutable-data */
  return [...values].sort((a: TArray, b: TArray) => {
    const orderDirection = order === 'desc' ? 1 : -1;
    const dateA = formatFromString(a[sortAttr] as unknown as string);
    const dateB = formatFromString(b[sortAttr] as unknown as string);
    if (dateA && dateB) {
      return orderDirection * (dateB.getTime() - dateA.getTime());
    }
    return orderDirection * (a[sortAttr] < b[sortAttr] ? 1 : -1);
  });
  /* eslint-enable functional/immutable-data */
}

/**
 This component overrides format detection of Safari in iOS such automatic conversion of numbers in telephone link numbers.
 This because the old meta tag name="format-detection" content="telephone=no" does not works anymore.
 */

export function DisableFormatDetection({ param }: { param: string }) {
  const matchString = param.match(dataRegex.phoneNumberAsSearch);
  if (matchString == null) {
    return <React.Fragment>{param}</React.Fragment>;
  }

  const numberMatch = matchString[0];
  const startMatch = param.indexOf(numberMatch);
  const endMatch = startMatch + numberMatch.length;
  const outputNumber = (
    <React.Fragment>
      {numberMatch.split('').map((s, i) => (
        <span key={`number_disabled_formatter_${i}`}>{s}</span>
      ))}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {param.substring(0, startMatch)}
      {outputNumber}
      {param.substring(endMatch)}
    </React.Fragment>
  );
}
