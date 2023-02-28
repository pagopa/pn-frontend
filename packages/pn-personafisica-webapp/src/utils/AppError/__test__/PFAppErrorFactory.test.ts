import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

import { PFAppErrorFactory } from '../PFAppErrorFactory';
import { ServerResponseErrorCode } from '../types';
import { GenericInvalidParameterPatternAppError } from '../GenericInvalidParameterPatternAppError';
import { MandateAlreadyExistsAppError } from '../MandateAlreadyExistsAppError';
import { MandateDelegateHimselfAppError } from '../MandateDelegateHimselfAppError';
import { MandateInvalidVerificationCodeAppError } from '../MandateInvalidVerificationCodeAppError';
import { MandateNotAcceptableAppError } from '../MandateNotAcceptableAppError';
import { MandateNotFoundAppError } from '../MandateNotFoundAppError';
import { UserAttributesInvalidVerificationCodeAppError } from '../UserAttributesInvalidVerificationCodeAppError';

class PFAppErrorFactoryForTest extends PFAppErrorFactory {
  constructor(translateFunction: (path: string, ns: string) => string) {
    super(translateFunction);
  }

  public getCustomErrorForTest: (error: ServerResponseError) => AppError = (
    error: ServerResponseError
  ) => this.getCustomError(error);
}

describe('Test PFAppErrorFactory', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;
  const errorFactory = new PFAppErrorFactoryForTest(translateFn);

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

  it('Should return MandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_NOTACCEPTABLE,
    });
    expect(errorClass).toBeInstanceOf(MandateNotAcceptableAppError);
  });

  it('Should return MandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_DELEGATEHIMSELF,
    });
    expect(errorClass).toBeInstanceOf(MandateDelegateHimselfAppError);
  });

  it('Should return MandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_MANDATE_INVALIDVERIFICATIONCODE,
    });
    expect(errorClass).toBeInstanceOf(MandateInvalidVerificationCodeAppError);
  });

  it('Should return MandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE,
    });
    expect(errorClass).toBeInstanceOf(UserAttributesInvalidVerificationCodeAppError);
  });

  it('Should return MandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_PATTERN,
    });
    expect(errorClass).toBeInstanceOf(GenericInvalidParameterPatternAppError);
  });
});
