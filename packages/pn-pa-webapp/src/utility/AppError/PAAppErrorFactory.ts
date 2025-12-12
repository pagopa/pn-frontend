import {
  AppError,
  AppErrorFactory,
  ServerResponseError,
  UnknownAppError,
} from '@pagopa-pn/pn-commons';

import { DeliveryFileInfoNotFoundAppError } from './DeliveryFileInfoNotFoundAppError';
import { DeliveryInvalidParameterGroupAppError } from './DeliveryInvalidParameterGroupAppError';
import { DeliveryNotificationLimitExceededAppError } from './DeliveryNotificationLimitExceededAppError';
import { DeliveryNotificationWithoutPaymentAttachmentAppError } from './DeliveryNotificationWithoutPaymentAttachmentAppError';
import { DeliveryPushFileNotFoundAppError } from './DeliveryPushFileNotFoundAppError';
import { GenericInvalidParameterAppError } from './GenericInvalidParameterAppError';
import { GenericInvalidParameterDuplicateAppError } from './GenericInvalidParameterDuplicateAppError';
import { GenericInvalidParameterTaxonomyCodeAppError } from './GenericInvalidParameterTaxonomyCodeAppError';
import { InvalidBodyAppError } from './InvalidBodyAppError';
import { ServerResponseErrorCode } from './types';

export class PAAppErrorFactory extends AppErrorFactory {
  private translateFunction: (path: string, ns: string) => string;

  constructor(translateFunction: (path: string, ns: string) => string) {
    super();
    this.translateFunction = translateFunction;
  }

  protected getCustomError: (error: ServerResponseError) => AppError = (
    error: ServerResponseError
  ) => {
    switch (error.code) {
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER:
        return new GenericInvalidParameterAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_DUPLICATED:
        return new GenericInvalidParameterDuplicateAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_TAXONOMYCODE:
        return new GenericInvalidParameterTaxonomyCodeAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_DELIVERY_NOTIFICATION_LIMIT_EXCEEDED:
        return new DeliveryNotificationLimitExceededAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_DELIVERY_FILEINFONOTFOUND:
        return new DeliveryFileInfoNotFoundAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT:
        return new DeliveryNotificationWithoutPaymentAttachmentAppError(
          error,
          this.translateFunction
        );
      case ServerResponseErrorCode.PN_DELIVERY_INVALIDPARAMETER_GROUP:
        return new DeliveryInvalidParameterGroupAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_DELIVERYPUSH_FILE_NOT_FOUND:
        return new DeliveryPushFileNotFoundAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_INVALID_BODY:
        return new InvalidBodyAppError(error, this.translateFunction);
      default:
        return new UnknownAppError(error);
    }
  };
}
