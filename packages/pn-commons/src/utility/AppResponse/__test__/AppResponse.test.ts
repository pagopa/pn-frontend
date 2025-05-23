import { ServerResponse, ServerResponseErrorCode } from '../../../models/AppResponse';
import { createAppResponseError, createAppResponseSuccess } from '../AppResponse';

describe('Creation of AppResponse objects', () => {
  it('createAppResponseError - server response including no data', () => {
    const serverResponse: ServerResponse = {
      status: 400,
    };
    const appResponse = createAppResponseError('mock-action', serverResponse);
    expect(appResponse).toEqual({
      action: 'mock-action',
      errors: [
        {
          code: ServerResponseErrorCode.BAD_REQUEST_ERROR,
          element: '',
          detail: '',
          message: {
            title: expect.stringMatching(/.*/),
            content: expect.stringMatching(/.*/),
          },
          showTechnicalData: false,
        },
      ],
    });
  });

  it('createAppResponseError - server response including one error', () => {
    const serverResponse: ServerResponse = {
      status: 400,
      data: {
        status: 400,
        traceId: 'TraceId-A',
        timestamp: '2022-10-05',
        errors: [{ code: ServerResponseErrorCode.BAD_REQUEST_ERROR }],
      },
    };
    const appResponse = createAppResponseError('mock-action', serverResponse);
    expect(appResponse).toEqual({
      action: 'mock-action',
      status: 400,
      traceId: 'TraceId-A',
      timestamp: '2022-10-05',
      errors: [
        {
          code: ServerResponseErrorCode.BAD_REQUEST_ERROR,
          element: '',
          detail: '',
          message: {
            title: expect.stringMatching(/.*/),
            content: expect.stringMatching(/.*/),
          },
          showTechnicalData: false,
        },
      ],
    });
  });

  it('createAppResponseError - server response including no errors', () => {
    const serverResponse: ServerResponse = {
      status: 401,
      data: {
        status: 401,
        traceId: 'TraceId-A',
        timestamp: '2022-10-05',
      },
    };
    const appResponse = createAppResponseError('mock-action', serverResponse);
    expect(appResponse).toEqual({
      action: 'mock-action',
      status: 401,
      traceId: 'TraceId-A',
      timestamp: '2022-10-05',
      errors: [
        {
          code: ServerResponseErrorCode.UNAUTHORIZED_ERROR,
          element: '',
          detail: '',
          message: {
            title: expect.stringMatching(/.*/),
            content: expect.stringMatching(/.*/),
          },
          showTechnicalData: false,
        },
      ],
    });
  });

  it('createAppResponseError - server response including an empty list of errors', () => {
    const serverResponse: ServerResponse = {
      status: 404,
      data: {
        status: 404,
        traceId: 'TraceId-A',
        timestamp: '2022-10-05',
        errors: [],
      },
    };
    const appResponse = createAppResponseError('mock-action', serverResponse);
    expect(appResponse).toEqual({
      action: 'mock-action',
      status: 404,
      traceId: 'TraceId-A',
      timestamp: '2022-10-05',
      errors: [
        {
          code: ServerResponseErrorCode.NOT_FOUND_ERROR,
          element: '',
          detail: '',
          message: {
            title: expect.stringMatching(/.*/),
            content: expect.stringMatching(/.*/),
          },
          showTechnicalData: false,
        },
      ],
    });
  });

  it('createAppResponseSuccess - server response including an empty list of errors', () => {
    const serverResponse: ServerResponse = {
      status: 200,
    };
    const appResponse = createAppResponseSuccess('mock-action', serverResponse);
    expect(appResponse).toEqual({
      action: 'mock-action',
      status: 200,
    });
  });
});
