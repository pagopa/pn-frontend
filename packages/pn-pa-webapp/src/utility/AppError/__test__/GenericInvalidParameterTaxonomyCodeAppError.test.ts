import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterTaxonomyCodeAppError } from '../GenericInvalidParameterTaxonomyCodeAppError';

describe('Test GenericInvalidParameterAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericInvalidParameterTaxonomyCodeAppError(
      {} as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe(
      'new-notification.errors.invalid_parameter_taxonomy_code.title notifiche'
    );
    expect(message.content).toBe(
      'new-notification.errors.invalid_parameter_taxonomy_code.message notifiche'
    );
  });

  it('getResponseError includes showTechnicalData = true and message', () => {
    const serverError = {
      code: 'mock-code',
      detail: 'mock-detail',
      element: 'mock-element',
    } as ServerResponseError;

    const appError = new GenericInvalidParameterTaxonomyCodeAppError(serverError, translateFn);

    expect(appError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      detail: 'mock-detail',
      element: 'mock-element',
      showTechnicalData: true,
      message: {
        title: 'new-notification.errors.invalid_parameter_taxonomy_code.title notifiche',
        content: 'new-notification.errors.invalid_parameter_taxonomy_code.message notifiche',
      },
    });
  });
});
