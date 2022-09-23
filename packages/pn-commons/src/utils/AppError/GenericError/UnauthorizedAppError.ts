import { AppErrorDetail, AppErrorTypes } from "../../../types/AppError";
import { AppError } from "../AppError";

export class UnauthorizedAppError extends AppError {
  type = AppErrorTypes.UNAUTHORIZED_ERROR;

  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%UNAUTHORIZED_ERROR_TITLE%",
      message: "%UNAUTHORIZED_ERROR_MESSAGE%"
    };
  }
}