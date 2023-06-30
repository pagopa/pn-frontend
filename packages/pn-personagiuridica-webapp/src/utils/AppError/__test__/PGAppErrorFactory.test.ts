import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

import { PGAppErrorFactory } from '../PGAppErrorFactory';
import { ServerResponseErrorCode } from '../types';
import { MandateAlreadyExistsAppError } from '../MandateAlreadyExistsAppError';
import { MandateDelegateHimselfAppError } from '../MandateDelegateHimselfAppError';
import { MandateInvalidVerificationCodeAppError } from '../MandateInvalidVerificationCodeAppError';
import { MandateNotAcceptableAppError } from '../MandateNotAcceptableAppError';
import { MandateNotFoundAppError } from '../MandateNotFoundAppError';
import { UserAttributesInvalidVerificationCodeAppError } from '../UserAttributesInvalidVerificationCodeAppError';

class PGAppErrorFactoryForTest extends PGAppErrorFactory {
  constructor(translateFunction: (path: string, ns: string) => string) {
    super(translateFunction);
  }

  public getCustomErrorForTest: (error: ServerResponseError) => AppError = (
    error: ServerResponseError
  ) => this.getCustomError(error);
}

describe('Test PGAppErrorFactory', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;
  const errorFactory = new PGAppErrorFactoryForTest(translateFn);

  it('Should return MandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_NOTFOUND,
    });
    expect(errorClass).toBeInstanceOf(MandateNotFoundAppError);
  });

  it('Should return MandateAlreadyExistsAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_ALREADYEXISTS,
    });
    expect(errorClass).toBeInstanceOf(MandateAlreadyExistsAppError);
  });

  it('Should return MandateNotAcceptableAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_NOTACCEPTABLE,
    });
    expect(errorClass).toBeInstanceOf(MandateNotAcceptableAppError);
  });

  it('Should return MandateDelegateHimselfAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_DELEGATEHIMSELF,
    });
    expect(errorClass).toBeInstanceOf(MandateDelegateHimselfAppError);
  });

  it('Should return MandateInvalidVerificationCodeAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_INVALIDVERIFICATIONCODE,
    });
    expect(errorClass).toBeInstanceOf(MandateInvalidVerificationCodeAppError);
  });

  it('Should return UserAttributesInvalidVerificationCodeAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE,
    });
    expect(errorClass).toBeInstanceOf(UserAttributesInvalidVerificationCodeAppError);
  });
});
