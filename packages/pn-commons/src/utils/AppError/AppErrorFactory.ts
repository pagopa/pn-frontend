import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";
import { UnknownAppError } from "./UnknownAppError";
import GenericAppErrorFactory from "./GenericError/GenericAppErrorFactory";
import { MandateAlreadyExistsAppError } from "./MandateAlreadyExistsAppError";
import { MandateDelegateHimselfAppError } from "./MandateDelegateHimselfAppError";
import { MandateInvalidVerificationCodeAppError } from "./MandateInvalidVerificationCodeAppError";
import { MandateNotAcceptableAppError } from "./MandateNotAcceptableAppError";
import { MandateNotFoundAppError } from "./MandateNotFoundAppError";

class AppErrorFactory {
  static create(error: AppErrorDetail): AppError {
    if(!error.code) {
      return GenericAppErrorFactory.create(error);
    }
    switch (error.code) {
      case AppErrorTypes.PN_MANDATE_NOTFOUND:
        return new MandateNotFoundAppError(error);
      case AppErrorTypes.PN_MANDATE_ALREADYEXISTS:
        return new MandateAlreadyExistsAppError(error);
      case AppErrorTypes.PN_MANDATE_NOTACCEPTABLE:
        return new MandateNotAcceptableAppError(error);
      case AppErrorTypes.PN_MANDATE_DELEGATEHIMSELF:
        return new MandateDelegateHimselfAppError(error);
      case AppErrorTypes.PN_MANDATE_INVALIDVERIFICATIONCODE:
        return new MandateInvalidVerificationCodeAppError(error);
      default:
        return new UnknownAppError(error);
    }
  }
}

export default AppErrorFactory;