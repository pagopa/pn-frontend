import {
  AppError,
  AppErrorFactory,
  ServerResponseError,
  UnknownAppError,
} from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterPatternAppError } from './GenericInvalidParameterPatternAppError';
import { InvalidBodyAppError } from './InvalidBodyAppError';
import { MandateAlreadyExistsAppError } from './MandateAlreadyExistsAppError';
import { MandateDelegateHimselfAppError } from './MandateDelegateHimselfAppError';
import { MandateInvalidVerificationCodeAppError } from './MandateInvalidVerificationCodeAppError';
import { MandateNotAcceptableAppError } from './MandateNotAcceptableAppError';
import { MandateNotFoundAppError } from './MandateNotFoundAppError';
import { UserAttributesInvalidVerificationCodeAppError } from './UserAttributesInvalidVerificationCodeAppError';
import { ServerResponseErrorCode } from './types';
import { DeliveryFileInfoNotFoundAppError } from './DeliveryFileInfoNotFoundAppError';
import { DeliveryNotificationWithoutPaymentAttachmentAppError } from './DeliveryNotificationWithoutPaymentAttachmentAppError';
import { DeliveryPushFileNotFoundAppError } from './DeliveryPushFileNotFoundAppError';

export class PGAppErrorFactory extends AppErrorFactory {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(translateFunction: (path: string, ns: string) => string) {
    super();
    this.translateFunction = translateFunction;
  }

  protected getCustomError: (error: ServerResponseError) => AppError = (
    error: ServerResponseError
  ) => {
    switch (error.code) {
      case ServerResponseErrorCode.PN_MANDATE_NOTFOUND:
        return new MandateNotFoundAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_MANDATE_ALREADYEXISTS:
        return new MandateAlreadyExistsAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_MANDATE_NOTACCEPTABLE:
        return new MandateNotAcceptableAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_MANDATE_DELEGATEHIMSELF:
        return new MandateDelegateHimselfAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_MANDATE_INVALIDVERIFICATIONCODE:
        return new MandateInvalidVerificationCodeAppError(error, this.translateFunction);
      // I am using a fallthrough to avoid to define a factory for every error of user attributes having the same
      // scope, i find it easier to edit them all in one place instead of three
      case ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE:
      case ServerResponseErrorCode.PN_USERATTRIBUTES_RETRYLIMITVERIFICATIONCODE:
      case ServerResponseErrorCode.PN_USERATTRIBUTES_EXPIREDVERIFICATIONCODE:
        return new UserAttributesInvalidVerificationCodeAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_PATTERN:
        return new GenericInvalidParameterPatternAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_INVALID_BODY:
        return new InvalidBodyAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_DELIVERY_FILEINFONOTFOUND:
        return new DeliveryFileInfoNotFoundAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT:
        return new DeliveryNotificationWithoutPaymentAttachmentAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_DELIVERYPUSH_FILE_NOT_FOUND:
        return new DeliveryPushFileNotFoundAppError(error, this.translateFunction);
      default:
        return new UnknownAppError(error);
    }
  };
}
