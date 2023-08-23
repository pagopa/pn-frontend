import {
  AppError,
  AppErrorFactory,
  ServerResponseError,
  UnknownAppError,
} from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterAppError } from './GenericInvalidParameterAppError';
import { ServerResponseErrorCode } from './types';
import { GenericInvalidParameterDuplicateAppError } from './GenericInvalidParameterDuplicateAppError';
import { NotificationAlreadyCancelledAppError } from './NotificationAlreadyCancelledAppError';
import { GenericNotificationCancelledAppError } from './GenericNotificationCancelledAppError';

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
      case ServerResponseErrorCode.PN_NOTIFICATION_ALREADY_CANCELLED:
        return new NotificationAlreadyCancelledAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_GENERIC_CANCELLED_NOTIFICATION_ERROR:
        return new GenericNotificationCancelledAppError(error, this.translateFunction);
      default:
        return new UnknownAppError(error);
    }
  };
}
