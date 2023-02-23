import {
  AppError,
  AppErrorFactory,
  ServerResponseError,
  UnknownAppError,
} from '@pagopa-pn/pn-commons';

import { ServerResponseErrorCode } from './types';
import { MandateAlreadyExistsAppError } from './MandateAlreadyExistsAppError';
import { MandateDelegateHimselfAppError } from './MandateDelegateHimselfAppError';
import { MandateInvalidVerificationCodeAppError } from './MandateInvalidVerificationCodeAppError';
import { MandateNotAcceptableAppError } from './MandateNotAcceptableAppError';
import { MandateNotFoundAppError } from './MandateNotFoundAppError';
import { UserAttributesInvalidVerificationCodeAppError } from './UserAttributesInvalidVerificationCodeAppError';
import { GenericInvalidParameterPatternAppError } from './GenericInvalidParameterPatternAppError';

export class PFAppErrorFactory extends AppErrorFactory {
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
      case ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE:
        return new UserAttributesInvalidVerificationCodeAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_PATTERN:
        return new GenericInvalidParameterPatternAppError(error, this.translateFunction);
      default:
        return new UnknownAppError(error);
    }
  };
}
