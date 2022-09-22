import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

export class MandateAlreadyExistsAppError extends AppError {
  type = AppErrorTypes.PN_MANDATE_ALREADYEXISTS;
  
  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_ALREADY_EXISTS_TITLE%",
      message: "%MANDATE_ALREADY_EXISTS_MESSAGE%"
    };
  }
}