import { getDefaultDate, getValidValue } from '../genericFunctions.utility';
import { today, tenYearsAgo } from '../index';
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

describe('getDefaultDate function', () => {
    it('return date3 value', () => {
        const date1 = today;
        const date2 = tenYearsAgo;
        const date3 = '01-01-2022';
        expect(getDefaultDate(date1, date2, date3)).toBeInstanceOf(Date);
    })

    it('return null value', () => {
        const date1 = new Date();
        const date2 = date1;
        const date3 = '01-01-2022';
        console.log(getDefaultDate(date1, date2, date3));
        expect(getDefaultDate(date1, date2, date3)).toBeNull();
    })
});