import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

enum InvalidParameter {
  FISCAL_CODE = 'delegate.fiscalCode',
}

export class GenericInvalidParameterPatternAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    if (this.element === InvalidParameter.FISCAL_CODE) {
      return {
        title: this.translateFunction('errors.fiscal_code.title', 'deleghe'),
        content: this.translateFunction('errors.fiscal_code.message', 'deleghe'),
      };
    }
    return {
      title: this.translateFunction('errors.invalid_parameter.title', 'common'),
      content: this.translateFunction('errors.invalid_parameter.message', 'common'),
    };
  }
}
