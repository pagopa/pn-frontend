import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterPatternAppError } from '../GenericInvalidParameterPatternAppError';

describe('Test GenericInvalidParameterPatternAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericInvalidParameterPatternAppError(
      {} as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.invalid_parameter.title deleghe');
    expect(messege.content).toBe('errors.invalid_parameter.message deleghe');
  });

  it('Should return invalid fiscal code message', () => {
    const appError = new GenericInvalidParameterPatternAppError(
      { element: 'delegate.fiscalCode' } as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.fiscal_code.title deleghe');
    expect(messege.content).toBe('errors.fiscal_code.message deleghe');
  });
});
