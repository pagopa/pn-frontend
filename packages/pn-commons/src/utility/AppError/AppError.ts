import { AppResponseError, ErrorMessage, ServerResponseError } from '../../models/AppResponse';

abstract class AppError {
  protected code: string;
  protected element: string;
  protected detail: string;

  constructor(error: ServerResponseError) {
    this.code = error.code;
    this.element = error.element || '';
    this.detail = error.detail || '';
  }

  getResponseError(): AppResponseError {
    return {
      code: this.code,
      element: this.element,
      detail: this.detail,
      message: {
        title: this.getMessage().title,
        content: this.getMessage().content,
      },
    };
  }

  abstract getMessage(): ErrorMessage;
}

export default AppError;
