import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

export class MandateInvalidVerificationCodeAppError extends AppError {
  type = AppErrorTypes.PN_MANDATE_INVALIDVERIFICATIONCODE;

  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_INVALIDVERIFICATIONCODE_TITLE%",
      message: "%MANDATE_INVALIDVERIFICATIONCODE_MESSAGE%"
    };
  }
}