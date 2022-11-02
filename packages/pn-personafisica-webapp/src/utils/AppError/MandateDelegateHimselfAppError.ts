import { AppError, ServerResponseError } from "@pagopa-pn/pn-commons";

export class MandateDelegateHimselfAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('errors.delegate_himself.title', 'deleghe' ),
      content: this.translateFunction('errors.delegate_himself.message', 'deleghe')
    };
  }
}