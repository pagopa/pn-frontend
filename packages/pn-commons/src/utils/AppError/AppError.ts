import { ServerResponseError, ServerResponseErrorCode, ErrorMessage } from '../../types/AppResponse';

abstract class AppError {
  protected code: ServerResponseErrorCode;
  protected element: string;

  constructor(error: ServerResponseError) {
    this.code = error.code;
    this.element = error.element || "";
  }

  getErrorDetail(): ServerResponseError {
    return {
      code: this.code,
      element: this.element
    };
  }

  abstract getMessage(): ErrorMessage;
}

export default AppError;
