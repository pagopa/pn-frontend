import _ from 'lodash';
import { formatFromString } from './date.utility';
export function getValidValue(a, b) {
    return a || (b ? b : '');
}
/**
 * Returns the number of filters applied
 * @param  prevFilters TFilters
 * @param  emptyValues TFilters
 * @returns number
 */
export function filtersApplied(prevFilters, emptyValues) {
    return Object.entries(prevFilters).reduce((c, element) => {
        if (element[0] in emptyValues && !_.isEqual(element[1], emptyValues[element[0]])) {
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
export function sortArray(order, sortAttr, values) {
    /* eslint-disable functional/immutable-data */
    return [...values].sort((a, b) => {
        const orderDirection = order === 'desc' ? 1 : -1;
        const dateA = formatFromString(a[sortAttr]);
        const dateB = formatFromString(b[sortAttr]);
        if (dateA && dateB) {
            return orderDirection * (dateB.getTime() - dateA.getTime());
        }
        return orderDirection * (a[sortAttr] < b[sortAttr] ? 1 : -1);
    });
    /* eslint-enable functional/immutable-data */
}
