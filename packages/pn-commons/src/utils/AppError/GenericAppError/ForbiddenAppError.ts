import { ServerResponseError, ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";

export class ForbiddenAppError extends AppError {
  type = ServerResponseErrorCode.FORBIDDEN_ERROR;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%FORBIDDEN_ERROR_TITLE%",
      message: "%FORBIDDEN_ERROR_MESSAGE%"
    };
  }
}