import { ServerResponseError, ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";

export class UnhandledAppError extends AppError {
  type = ServerResponseErrorCode.UNHANDLED_ERROR;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%UNHANDLED_ERROR_TITLE%",
      message: "%UNHANDLED_ERROR_MESSAGE%"
    };
  }
}