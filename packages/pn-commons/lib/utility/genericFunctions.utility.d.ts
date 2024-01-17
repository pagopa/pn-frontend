export declare function getValidValue(a: string | number | undefined, b?: string | number): any;
/**
 * Returns the number of filters applied
 * @param  prevFilters TFilters
 * @param  emptyValues TFilters
 * @returns number
 */
export declare function filtersApplied<TFilters extends object>(prevFilters: TFilters, emptyValues: TFilters): number;
/**
 * Sorts an array of object
 * @template TArray
 * @param {('desc' | 'asc')} order descending or ascending order
 * @param {keyof TArray} sortAttr attribute on witch order
 * @param {Array<TArray>} values array to order
 * @returns array
 */
export declare function sortArray<TArray>(order: 'desc' | 'asc', sortAttr: keyof TArray | '', values: Array<TArray>): TArray[];
