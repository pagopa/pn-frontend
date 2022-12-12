import {
  ServerResponseError,
  ErrorMessage,
  AppResponseError } from '../../types/AppResponse';

abstract class AppError {
  protected code: string;
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

  getResponseError(): AppResponseError {
    return {
      code: this.code,
      element: this.element,
      message: {
        title: this.getMessage().title,
        content: this.getMessage().content
      }
    };
  }

  abstract getMessage(): ErrorMessage;
}

export default AppError;
