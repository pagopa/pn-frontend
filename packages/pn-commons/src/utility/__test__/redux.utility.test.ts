import { parseError } from '../redux.utility';

describe('parseError', () => {
  it('should use traceId from headers if present', () => {
    const error = {
      response: {
        data: {
          message: 'An error occurred',
          traceId: 'custom-trace-id',
        },
        status: 404,
        headers: {
          'x-amzn-trace-id': '1-67891233-abcdef1234567890abcdef',
        },
      },
    };

    const result = parseError(error);

    expect(result).toEqual({
      response: {
        data: {
          message: 'An error occurred',
          traceId: '1-67891233-abcdef1234567890abcdef',
        },
        status: 404,
      },
    });
  });

  it('should use traceId from data if not present in headers', () => {
    const error = {
      response: {
        data: {
          message: 'An error occurred',
          traceId: 'custom-trace-id',
        },
        status: 400,
      },
    };

    const result = parseError(error);

    expect(result).toEqual({
      response: {
        data: {
          message: 'An error occurred',
          traceId: 'custom-trace-id',
        },
        status: 400,
      },
    });
  });

  it('should set default status to 500 if not provided', () => {
    const error = {
      response: {
        data: {
          message: 'An error occurred',
        },
        headers: {},
      },
    };

    const result = parseError(error);

    expect(result).toEqual({
      response: {
        data: {
          message: 'An error occurred',
          traceId: '',
        },
        status: 500,
      },
    });
  });

  it('should handle error without response', () => {
    const error = {
      message: 'Something went wrong',
    };

    const result = parseError(error);

    expect(result).toEqual({
      response: {
        status: 500,
      },
    });
  });

  it('should handle empty response object', () => {
    const error = {
      response: {},
    };

    const result = parseError(error);

    expect(result).toEqual({
      response: {
        data: {
          traceId: '',
        },
        status: 500,
      },
    });
  });
});
