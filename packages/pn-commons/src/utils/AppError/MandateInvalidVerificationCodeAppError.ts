import { ServerResponseError, ServerResponseErrorCode } from "../../types/AppError";
import AppError from "./AppError";

export class MandateInvalidVerificationCodeAppError extends AppError {
  type = ServerResponseErrorCode.PN_MANDATE_INVALIDVERIFICATIONCODE;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_INVALIDVERIFICATIONCODE_TITLE%",
      message: "%MANDATE_INVALIDVERIFICATIONCODE_MESSAGE%"
    };
  }
}