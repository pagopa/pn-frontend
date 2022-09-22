import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

export class MandateDelegateHimselfAppError extends AppError {
  type = AppErrorTypes.PN_MANDATE_DELEGATEHIMSELF;

  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_DELEGATEHIMSELF_TITLE%",
      message: "%MANDATE_DELEGATEHIMSELF_MESSAGE%"
    };
  }
}