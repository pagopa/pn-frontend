import { ServerResponseError, ServerResponseErrorCode } from "../../types/AppError";
import AppError from "./AppError";

export class UnknownAppError extends AppError {
  type = ServerResponseErrorCode.UNKNOWN_ERROR;
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%UNKNOWN_ERROR_TITLE%",
      message: "%UNKNOWN_ERROR_MESSAGE%"
    };
  }
}