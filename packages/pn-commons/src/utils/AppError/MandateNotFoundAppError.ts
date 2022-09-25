import { ServerResponseError, ServerResponseErrorCode } from "../../types/AppError";
import AppError from "./AppError";

export class MandateNotFoundAppError extends AppError {
  type = ServerResponseErrorCode.PN_MANDATE_ALREADYEXISTS;
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_NOT_FOUND_TITLE%",
      message: "%MANDATE_NOT_FOUND_MESSAGE%"
    };
  }
}