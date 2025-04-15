import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterPatternAppError } from '../GenericInvalidParameterPatternAppError';

describe('Test GenericInvalidParameterPatternAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericInvalidParameterPatternAppError(
      {} as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('errors.invalid_parameter.title common');
    expect(message.content).toBe('errors.invalid_parameter.message common');
  });

  it('Should return invalid fiscal code message', () => {
    const appError = new GenericInvalidParameterPatternAppError(
      { element: 'delegate.fiscalCode' } as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('errors.fiscal_code.title deleghe');
    expect(message.content).toBe('errors.fiscal_code.message deleghe');
  });
});
