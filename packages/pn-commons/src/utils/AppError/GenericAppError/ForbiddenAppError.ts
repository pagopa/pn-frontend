import { ServerResponseError, ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";

export class ForbiddenAppError extends AppError {
  type = ServerResponseErrorCode.FORBIDDEN_ERROR;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%NOT_FOUND_ERROR_TITLE%",
      message: "%NOT_FOUND_ERROR_MESSAGE%"
    };
  }
}