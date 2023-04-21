import _ from 'lodash';

export function getValidValue(a: string | number | undefined, b?: string | number): any {
  return a || (b ? b : '');
}

/**
 * Returns the number of filters applied
 * @param  prevFilters TFilters
 * @param  emptyValues TFilters
 * @returns number
 */
export function filtersApplied<TFilters extends Object>(
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
