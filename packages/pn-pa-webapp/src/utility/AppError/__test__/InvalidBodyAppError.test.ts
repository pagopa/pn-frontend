import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { InvalidBodyAppError } from '../InvalidBodyAppError';

describe('InvalidBodyAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('getMessage returns translated title and content', () => {
    const appError = new InvalidBodyAppError({} as ServerResponseError, translateFn);

    expect(appError.getMessage()).toStrictEqual({
      title: 'errors.invalid_body.title common',
      content: 'errors.invalid_body.message common',
    });
  });

  it('getResponseError includes showTechnicalData = true and message', () => {
    const error: ServerResponseError = {
      code: 'mock-code',
      detail: 'mock-detail',
      element: 'mock-element',
    };

    const appError = new InvalidBodyAppError(error, translateFn);

    expect(appError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      detail: 'mock-detail',
      element: 'mock-element',
      showTechnicalData: true,
      message: {
        title: 'errors.invalid_body.title common',
        content: 'errors.invalid_body.message common',
      },
    });
  });
});
