import { AppErrorDetail, AppErrorTypes } from "../../../types/AppError";
import { AppError } from "../AppError";

export class InternalServerAppError extends AppError {
  type = AppErrorTypes.INTERNAL_SERVER_ERROR;

  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%INTERNAL_SERVER_ERROR_TITLE%",
      message: "%INTERNAL_SERVER_ERROR_MESSAGE%"
    };
  }
}