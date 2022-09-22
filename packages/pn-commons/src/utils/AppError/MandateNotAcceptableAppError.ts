import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

export class MandateNotAcceptableAppError extends AppError {
  type = AppErrorTypes.PN_MANDATE_NOTACCEPTABLE;
  
  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_NOT_ACCEPTABLE_TITLE%",
      message: "%MANDATE_NOT_ACCEPTABLE_MESSAGE%"
    };
  }
}