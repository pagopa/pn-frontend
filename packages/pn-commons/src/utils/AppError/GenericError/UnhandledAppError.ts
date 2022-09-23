import { AppErrorDetail, AppErrorTypes } from "../../../types/AppError";
import { AppError } from "../AppError";

export class UnhandledAppError extends AppError {
  type = AppErrorTypes.UNHANDLED_ERROR;

  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%UNHANDLED_ERROR_TITLE%",
      message: "%UNHANDLED_ERROR_MESSAGE%"
    };
  }
}