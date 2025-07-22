import { AppError, ServerResponseError, UnknownAppError } from '@pagopa-pn/pn-commons';

import { DeliveryFileInfoNotFoundAppError } from '../DeliveryFileInfoNotFoundAppError';
import { DeliveryMandateNotFoundAppError } from '../DeliveryMandateNotFoundAppError';
import { DeliveryNotificationWithoutPaymentAttachmentAppError } from '../DeliveryNotificationWithoutPaymentAttachmentAppError';
import { DeliveryPushFileNotFoundAppError } from '../DeliveryPushFileNotFoundAppError';
import { GenericInvalidParameterPatternAppError } from '../GenericInvalidParameterPatternAppError';
import { InvalidBodyAppError } from '../InvalidBodyAppError';
import { MandateAlreadyExistsAppError } from '../MandateAlreadyExistsAppError';
import { MandateDelegateHimselfAppError } from '../MandateDelegateHimselfAppError';
import { MandateInvalidVerificationCodeAppError } from '../MandateInvalidVerificationCodeAppError';
import { MandateNotAcceptableAppError } from '../MandateNotAcceptableAppError';
import { MandateNotFoundAppError } from '../MandateNotFoundAppError';
import { PFAppErrorFactory } from '../PFAppErrorFactory';
import { UserAttributesInvalidVerificationCodeAppError } from '../UserAttributesInvalidVerificationCodeAppError';
import { ServerResponseErrorCode } from '../types';

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

  it('Should return GenericInvalidParameterPatternAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_PATTERN,
    });
    expect(errorClass).toBeInstanceOf(GenericInvalidParameterPatternAppError);
  });

  it('Should return DeliveryMandateNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERY_MANDATENOTFOUND,
    });
    expect(errorClass).toBeInstanceOf(DeliveryMandateNotFoundAppError);
  });

  it('Should return InvalidBodyAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_INVALID_BODY,
    });
    expect(errorClass).toBeInstanceOf(InvalidBodyAppError);
  });

  it('Should return DeliveryFileInfoNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERY_FILEINFONOTFOUND,
    });
    expect(errorClass).toBeInstanceOf(DeliveryFileInfoNotFoundAppError);
  });

  it('Should return DeliveryNotificationWithoutPaymentAttachmentAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT,
    });
    expect(errorClass).toBeInstanceOf(DeliveryNotificationWithoutPaymentAttachmentAppError);
  });

  it('Should return DeliveryPushFileNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERYPUSH_FILE_NOT_FOUND,
    });
    expect(errorClass).toBeInstanceOf(DeliveryPushFileNotFoundAppError);
  });

  it('Should return UnknownAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({ code: 'UNKNOWN_CODE' });
    expect(errorClass).toBeInstanceOf(UnknownAppError);
  });
});
