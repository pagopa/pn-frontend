import { AppError, ServerResponseError } from "@pagopa-pn/pn-commons";

export class UserAttributesInvalidVerificationCodeAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('errors.invalid_verification_code.title', 'recapiti' ),
      content: this.translateFunction('errors.invalid_verification_code.message', 'recapiti')
    };
  }
}