import { AppResponseError, ErrorMessage, ServerResponseError } from '../../models/AppResponse';

abstract class AppError {
  protected code: string;
  protected element: string;
  protected detail: string;
  protected showTechnicalData: boolean;

  constructor(error: ServerResponseError, showTechnicalData = false) {
    this.code = error.code;
    this.element = error.element || '';
    this.detail = error.detail || '';
    this.showTechnicalData = showTechnicalData;
  }

  getResponseError(): AppResponseError {
    return {
      code: this.code,
      element: this.element,
      detail: this.detail,
      showTechnicalData: this.showTechnicalData,
      message: {
        title: this.getMessage().title,
        content: this.getMessage().content,
      },
    };
  }

  abstract getMessage(): ErrorMessage;
}

export default AppError;
