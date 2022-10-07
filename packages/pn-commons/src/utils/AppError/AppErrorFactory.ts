import { HTTPStatusCode, ServerResponseError, ServerResponseErrorCode } from "../../types/AppResponse";
import AppError from "./AppError";
import { UnknownAppError } from "./UnknownAppError";
import { MandateAlreadyExistsAppError } from "./MandateAlreadyExistsAppError";
import { MandateDelegateHimselfAppError } from "./MandateDelegateHimselfAppError";
import { MandateInvalidVerificationCodeAppError } from "./MandateInvalidVerificationCodeAppError";
import { MandateNotAcceptableAppError } from "./MandateNotAcceptableAppError";
import { MandateNotFoundAppError } from "./MandateNotFoundAppError";
import GenericAppErrorFactory from "./GenericAppError/GenericAppErrorFactory";
import { UserAttributesInvalidVerificationCodeAppError } from "./UserAttributesInvalidVerificationCodeAppError";

class AppErrorFactory {
  static create(error: ServerResponseError | HTTPStatusCode): AppError {
    if(typeof error !== 'object') {
      return GenericAppErrorFactory.create(error);
    }
    switch (error.code) {
      case ServerResponseErrorCode.PN_MANDATE_NOTFOUND:
        return new MandateNotFoundAppError(error);
      case ServerResponseErrorCode.PN_MANDATE_ALREADYEXISTS:
        return new MandateAlreadyExistsAppError(error);
      case ServerResponseErrorCode.PN_MANDATE_NOTACCEPTABLE:
        return new MandateNotAcceptableAppError(error);
      case ServerResponseErrorCode.PN_MANDATE_DELEGATEHIMSELF:
        return new MandateDelegateHimselfAppError(error);
      case ServerResponseErrorCode.PN_MANDATE_INVALIDVERIFICATIONCODE:
        return new MandateInvalidVerificationCodeAppError(error);
      case ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE:
        return new UserAttributesInvalidVerificationCodeAppError(error);
      default:
        return new UnknownAppError(error);
    }
  }
}

export default AppErrorFactory;