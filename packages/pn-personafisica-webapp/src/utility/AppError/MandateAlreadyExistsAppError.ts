import { AppError, ServerResponseError } from "@pagopa-pn/pn-commons";

export class MandateAlreadyExistsAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;
  
  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('errors.already_exists.title', 'deleghe' ),
      content: this.translateFunction('errors.already_exists.message', 'deleghe')
    };
  }
}