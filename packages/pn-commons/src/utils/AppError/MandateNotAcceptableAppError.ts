import { ServerResponseError, ServerResponseErrorCode } from "../../types/AppError";
import AppError from "./AppError";

export class MandateNotAcceptableAppError extends AppError {
  type = ServerResponseErrorCode.PN_MANDATE_NOTACCEPTABLE;
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_NOT_ACCEPTABLE_TITLE%",
      message: "%MANDATE_NOT_ACCEPTABLE_MESSAGE%"
    };
  }
}