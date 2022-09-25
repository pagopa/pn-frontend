import { ServerResponseError, ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";

export class InternalServerAppError extends AppError {
  type = ServerResponseErrorCode.INTERNAL_SERVER_ERROR;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%INTERNAL_SERVER_ERROR_TITLE%",
      message: "%INTERNAL_SERVER_ERROR_MESSAGE%"
    };
  }
}