import { ServerResponseError, ServerResponseErrorCode } from "../../types/AppError";
import AppError from "./AppError";

export class MandateDelegateHimselfAppError extends AppError {
  type = ServerResponseErrorCode.PN_MANDATE_DELEGATEHIMSELF;

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: "%MANDATE_DELEGATEHIMSELF_TITLE%",
      message: "%MANDATE_DELEGATEHIMSELF_MESSAGE%"
    };
  }
}