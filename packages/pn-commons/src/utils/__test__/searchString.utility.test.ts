import { renderHook, act } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { searchStringLimitReachedText, useSearchStringChangeInput } from '../searchString.utility';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

describe('useSearchStringChangeInput', () => {
    let dispatchMock;
    let addErrorMock;

    beforeEach(() => {
        addErrorMock = jest.fn();
        dispatchMock = jest.fn().mockReturnValue({ addError: addErrorMock });
        (useDispatch as jest.Mock).mockReturnValue(dispatchMock);
    });

    afterEach(() => {
        (useDispatch as jest.Mock).mockReset();
        dispatchMock.mockReset();
        addErrorMock.mockReset();
    });

    it('should return a function', () => {
        const { result } = renderHook(() => useSearchStringChangeInput());
        expect(result.current).toBeInstanceOf(Function);
    });

    it('should clean the search string', () => {
        const { result } = renderHook(() => useSearchStringChangeInput());
        const setValueMock = jest.fn();

        act(() => {
            result.current('ABC∃de', setValueMock);
        });

        expect(setValueMock).toHaveBeenCalledWith('ABCde');
    });

    it('should limit the search string to the maximum length', () => {
        const { result } = renderHook(() => useSearchStringChangeInput(5));
        const setValueMock = jest.fn();

        act(() => {
            result.current('abcdefgh', setValueMock);
        });

        expect(setValueMock).toHaveBeenCalledWith('abcde');
    });

    it('should not display a limit text if search string is shorter than maximum length', () => {
        const searchString = 'abcde';
        const maxLength = 10;

        const result = searchStringLimitReachedText(searchString, maxLength);

        expect(result).toBe('');
    });

});
