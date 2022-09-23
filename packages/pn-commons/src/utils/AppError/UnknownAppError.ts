import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

export class UnknownAppError extends AppError {
  type = AppErrorTypes.UNKNOWN_ERROR;
  
  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%UNKNOWN_ERROR_TITLE%",
      message: "%UNKNOWN_ERROR_MESSAGE%"
    };
  }
}