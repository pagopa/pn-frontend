import { AppError, ServerResponseError, UnknownAppError } from '@pagopa-pn/pn-commons';

import { DeliveryFileInfoNotFoundAppError } from '../DeliveryFileInfoNotFoundAppError';
import { DeliveryInvalidParameterGroupAppError } from '../DeliveryInvalidParameterGroupAppError';
import { DeliveryNotificationLimitExceededAppError } from '../DeliveryNotificationLimitExceededAppError';
import { DeliveryNotificationWithoutPaymentAttachmentAppError } from '../DeliveryNotificationWithoutPaymentAttachmentAppError';
import { DeliveryPushFileNotFoundAppError } from '../DeliveryPushFileNotFoundAppError';
import { GenericInvalidParameterAppError } from '../GenericInvalidParameterAppError';
import { GenericInvalidParameterDuplicateAppError } from '../GenericInvalidParameterDuplicateAppError';
import { GenericInvalidParameterTaxonomyCodeAppError } from '../GenericInvalidParameterTaxonomyCodeAppError';
import { InvalidBodyAppError } from '../InvalidBodyAppError';
import { PAAppErrorFactory } from '../PAAppErrorFactory';
import { ServerResponseErrorCode } from '../types';

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

  it('should return GenericInvalidParameterAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER,
    });
    expect(errorClass).toBeInstanceOf(GenericInvalidParameterAppError);
  });

  it('should return GenericInvalidParameterDuplicateAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_DUPLICATED,
    });
    expect(errorClass).toBeInstanceOf(GenericInvalidParameterDuplicateAppError);
  });

  it('should return GenericInvalidParameterTaxonomyCodeAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_TAXONOMYCODE,
    });
    expect(errorClass).toBeInstanceOf(GenericInvalidParameterTaxonomyCodeAppError);
  });

  it('should return DeliveryNotificationLimitExceededAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERY_NOTIFICATION_LIMIT_EXCEEDED,
    });
    expect(errorClass).toBeInstanceOf(DeliveryNotificationLimitExceededAppError);
  });

  it('should return DeliveryFileInfoNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERY_FILEINFONOTFOUND,
    });
    expect(errorClass).toBeInstanceOf(DeliveryFileInfoNotFoundAppError);
  });

  it('should return DeliveryNotificationWithoutPaymentAttachmentAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT,
    });
    expect(errorClass).toBeInstanceOf(DeliveryNotificationWithoutPaymentAttachmentAppError);
  });

  it('should return DeliveryInvalidParameterGroupAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERY_INVALIDPARAMETER_GROUP,
    });
    expect(errorClass).toBeInstanceOf(DeliveryInvalidParameterGroupAppError);
  });

  it('should return DeliveryPushFileNotFoundAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_DELIVERYPUSH_FILE_NOT_FOUND,
    });
    expect(errorClass).toBeInstanceOf(DeliveryPushFileNotFoundAppError);
  });

  it('should return InvalidBodyAppError', () => {
    const errorClass = errorFactory.getCustomErrorForTest({
      code: ServerResponseErrorCode.PN_INVALID_BODY,
    });
    expect(errorClass).toBeInstanceOf(InvalidBodyAppError);
  });

  it('should return UnknownAppError for unknown code', () => {
    const errorClass = errorFactory.getCustomErrorForTest({ code: 'UNKNOWN_CODE' });
    expect(errorClass).toBeInstanceOf(UnknownAppError);
  });
});
