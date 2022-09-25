import { ServerResponseError, ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";

export class NotFoundAppError extends AppError {
  type = ServerResponseErrorCode.NOT_FOUND_ERROR;

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