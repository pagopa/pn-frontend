import { getAorB } from '../genericFunctions.utility';

describe('get A or B function', () => {
    it('return A value', () => {
        const valueA = 'mock-value-a';
        const valueB = undefined;
        expect(getAorB(valueA, valueB)).toBe('mock-value-a');
    });

    it('return B value', () => {
        const valueA = undefined;
        const valueB = 'mock-value-b';
        expect(getAorB(valueA, valueB)).toBe('mock-value-b');
    });

    it('return undefined value', () => {
        const valueA = undefined;
        const valueB = undefined;
        expect(getAorB(valueA, valueB)).toBe(undefined);
    });
});