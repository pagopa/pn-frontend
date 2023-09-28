import { performThunkAction } from "../redux.utility";

// Mock an asynchronous action function for testing
const mockAsyncAction = async (params) => {
    if (params === 'error') {
        throw new Error('Test Error');
    }
    return `Result for ${params}`;
};

describe('performThunkAction', () => {
    it('should call the action function with the provided parameters', async () => {
        const params = 'testParams';
        const actionSpy = jest.fn(mockAsyncAction);
        const thunkAction = performThunkAction(actionSpy);

        await thunkAction(params, { rejectWithValue: jest.fn() });

        expect(actionSpy).toHaveBeenCalledWith(params);
    });

    it('should return the result of the action function on success', async () => {
        const params = 'testParams';
        const expectedResult = `Result for ${params}`;
        const thunkAction = performThunkAction(mockAsyncAction);

        const result = await thunkAction(params, { rejectWithValue: jest.fn() });

        expect(result).toBe(expectedResult);
    });

    it('should call rejectWithValue with a parsed error on failure', async () => {
        const errorParams = 'error';
        const error = new Error('Test Error');
        const rejectWithValueSpy = jest.fn();
        const thunkAction = performThunkAction(mockAsyncAction);

        await thunkAction(errorParams, { rejectWithValue: rejectWithValueSpy });

        // Check if rejectWithValue was called with an error object
        expect(rejectWithValueSpy).toHaveBeenCalledWith({ "response": { "status": 500 } });
    });
});
