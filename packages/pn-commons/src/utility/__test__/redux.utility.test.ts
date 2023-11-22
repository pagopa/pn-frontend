import { vi } from 'vitest';
import { performThunkAction } from '../redux.utility';

// Mock an asynchronous action function for testing
const mockAsyncAction = async (params) => {
  if (params === 'error') {
    throw new Error('Test Error');
  } else if (params === 'error_response_no_status') {
    throw {
      response: {
        data: 'Some error data',
      },
    };
  } else if (params === 'error_response') {
    throw {
      extraData: 'Some extra data',
      response: {
        data: 'Some error data',
        status: 400,
      },
    };
  }
  return `Result for ${params}`;
};

describe('performThunkAction', () => {
  it('should call the action function with the provided parameters', async () => {
    const params = 'testParams';
    const actionSpy = vi.fn(mockAsyncAction);
    const thunkAction = performThunkAction(actionSpy);

    await thunkAction(params, { rejectWithValue: vi.fn() });

    expect(actionSpy).toHaveBeenCalledWith(params);
  });

  it('should return the result of the action function on success', async () => {
    const params = 'testParams';
    const expectedResult = `Result for ${params}`;
    const thunkAction = performThunkAction(mockAsyncAction);

    const result = await thunkAction(params, { rejectWithValue: vi.fn() });

    expect(result).toBe(expectedResult);
  });

  it('should call rejectWithValue with a parsed error on failure - no error response', async () => {
    const errorParams = 'error';
    const rejectWithValueSpy = vi.fn();
    const thunkAction = performThunkAction(mockAsyncAction);

    await thunkAction(errorParams, { rejectWithValue: rejectWithValueSpy });

    // Check if rejectWithValue was called with an error object
    expect(rejectWithValueSpy).toHaveBeenCalledWith({ response: { status: 500 } });
  });

  it('should call rejectWithValue with a parsed error on failure - error without status', async () => {
    const errorParams = 'error_response_no_status';
    const rejectWithValueSpy = vi.fn();
    const thunkAction = performThunkAction(mockAsyncAction);

    await thunkAction(errorParams, { rejectWithValue: rejectWithValueSpy });

    // Check if rejectWithValue was called with an error object
    expect(rejectWithValueSpy).toHaveBeenCalledWith({
      response: { data: 'Some error data', status: 500 },
    });
  });

  it('should call rejectWithValue with a parsed error on failure - error with all data', async () => {
    const errorParams = 'error_response';
    const rejectWithValueSpy = vi.fn();
    const thunkAction = performThunkAction(mockAsyncAction);

    await thunkAction(errorParams, { rejectWithValue: rejectWithValueSpy });

    // Check if rejectWithValue was called with an error object
    expect(rejectWithValueSpy).toHaveBeenCalledWith({
      response: { data: 'Some error data', status: 400 },
    });
  });
});
