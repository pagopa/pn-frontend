import { ServerResponseError, ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";

export class BadRequestAppError extends AppError {
  type = ServerResponseErrorCode.BAD_REQUEST_ERROR;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%BAD_REQUEST_ERROR_TITLE%",
      message: "%BAD_REQUEST_ERROR_MESSAGE%"
    };
  }
}