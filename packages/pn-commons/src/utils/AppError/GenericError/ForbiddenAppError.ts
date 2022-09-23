import { AppErrorDetail, AppErrorTypes } from "../../../types/AppError";
import { AppError } from "../AppError";

export class ForbiddenAppError extends AppError {
  type = AppErrorTypes.FORBIDDEN_ERROR;

  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%NOT_FOUND_ERROR_TITLE%",
      message: "%NOT_FOUND_ERROR_MESSAGE%"
    };
  }
}