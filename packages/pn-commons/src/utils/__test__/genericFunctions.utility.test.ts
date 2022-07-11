import { getValidValue } from '../genericFunctions.utility';

describe('get A or B function', () => {
    it('return A value', () => {
        const valueA = 'mock-value-a';
        expect(getValidValue(valueA)).toBe('mock-value-a');
    });

    it('return B value', () => {
        const valueA = undefined;
        const valueB = 'mock-value-b';
        expect(getValidValue(valueA, valueB)).toBe('mock-value-b');
    });

    it('return undefined value', () => {
        const valueA = undefined;
        const valueB = undefined;
        expect(getValidValue(valueA, valueB)).toBe(undefined);
    });
});