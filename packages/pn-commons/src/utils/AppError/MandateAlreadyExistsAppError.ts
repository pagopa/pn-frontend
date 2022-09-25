import { ServerResponseError, ServerResponseErrorCode } from "../../types/AppError";
import AppError from "./AppError";

export class MandateAlreadyExistsAppError extends AppError {
  type = ServerResponseErrorCode.PN_MANDATE_ALREADYEXISTS;
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_ALREADY_EXISTS_TITLE%",
      message: "%MANDATE_ALREADY_EXISTS_MESSAGE%"
    };
  }
}