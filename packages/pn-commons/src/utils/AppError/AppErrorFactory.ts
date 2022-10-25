import {
  HTTPStatusCode,
  ServerResponseError,
} from "../../types/AppResponse";
import AppError from "./AppError";
import UnknownAppError from "./UnknownAppError";
import GenericAppErrorFactory from "./GenericAppError/GenericAppErrorFactory";

class AppErrorFactory {
  protected getCustomError: (error: ServerResponseError) => AppError = (error: ServerResponseError) => new UnknownAppError(error);

  public create(error: ServerResponseError | HTTPStatusCode): AppError {
    if(typeof error !== 'object') {
      return GenericAppErrorFactory.create(error);
    }

    return this.getCustomError(error);
    // switch (error.code) {
    //   case ServerResponseErrorCode.PN_MANDATE_NOTFOUND:
    //     return new MandateNotFoundAppError(error);
    //   case ServerResponseErrorCode.PN_MANDATE_ALREADYEXISTS:
    //     return new MandateAlreadyExistsAppError(error);
    //   case ServerResponseErrorCode.PN_MANDATE_NOTACCEPTABLE:
    //     return new MandateNotAcceptableAppError(error);
    //   case ServerResponseErrorCode.PN_MANDATE_DELEGATEHIMSELF:
    //     return new MandateDelegateHimselfAppError(error);
    //   case ServerResponseErrorCode.PN_MANDATE_INVALIDVERIFICATIONCODE:
    //     return new MandateInvalidVerificationCodeAppError(error);
    //   case ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE:
    //     return new UserAttributesInvalidVerificationCodeAppError(error);
    //   default:
    //     return new UnknownAppError(error);
    // }
  }
}

export default AppErrorFactory;