import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

export class MandateNotFoundAppError extends AppError {
  type = AppErrorTypes.PN_MANDATE_ALREADYEXISTS;
  
  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_NOT_FOUND_TITLE%",
      message: "%MANDATE_NOT_FOUND_MESSAGE%"
    };
  }
}