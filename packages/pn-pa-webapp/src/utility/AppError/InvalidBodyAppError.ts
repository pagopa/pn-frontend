import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class InvalidBodyAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error, true);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('errors.invalid_body.title', 'common'),
      content: this.translateFunction('errors.invalid_body.message', 'common'),
    };
  }
}