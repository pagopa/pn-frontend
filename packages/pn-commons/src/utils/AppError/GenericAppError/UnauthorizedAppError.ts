import { ServerResponseError, ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";

export class UnauthorizedAppError extends AppError {
  type = ServerResponseErrorCode.UNAUTHORIZED_ERROR;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%UNAUTHORIZED_ERROR_TITLE%",
      message: "%UNAUTHORIZED_ERROR_MESSAGE%"
    };
  }
}