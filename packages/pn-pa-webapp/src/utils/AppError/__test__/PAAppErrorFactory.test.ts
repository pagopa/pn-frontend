import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

import { PAAppErrorFactory } from '../PAAppErrorFactory';
import { ServerResponseErrorCode } from '../types';
import { GenericInvalidParameterAppError } from '../GenericInvalidParameterAppError';

class PAAppErrorFactoryForTest extends PAAppErrorFactory {
  constructor(translateFunction: (path: string, ns: string) => string) {
    super(translateFunction);
  }

  public getCustomErrorForTest: (error: ServerResponseError) => AppError = (
    error: ServerResponseError
  ) => this.getCustomError(error);
}

describe('Test PFAppErrorFactory', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;
  const errorFactory = new PAAppErrorFactoryForTest(translateFn);

  it('Should return MandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER,
    });
    expect(errorClass).toBeInstanceOf(GenericInvalidParameterAppError);
  });
});
