import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';
import { ServerResponseErrorCode } from './types';

export class UserAttributesInvalidVerificationCodeAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    switch (this.code) {
      case ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE:
        return {
          title: this.translateFunction('errors.invalid_verification_code.title', 'recapiti'),
          content: this.translateFunction('errors.invalid_verification_code.message', 'recapiti'),
        };
      // subsequent calls to try to validate the pec will bring to the next case PN_USERATTRIBUTES_EXPIREDVERIFICATIONCODE
      case ServerResponseErrorCode.PN_USERATTRIBUTES_RETRYLIMITVERIFICATIONCODE:
        return {
          title: this.translateFunction('errors.retry_limit_code.title', 'recapiti'),
          content: this.translateFunction('errors.retry_limit_code.message', 'recapiti'),
        };
      // this case is reached if the token is expired by time or retry limit
      case ServerResponseErrorCode.PN_USERATTRIBUTES_EXPIREDVERIFICATIONCODE:
        return {
          title: this.translateFunction('errors.expired_verification_code.title', 'recapiti'),
          content: this.translateFunction('errors.expired_verification_code.message', 'recapiti'),
        };
      default:
        return {
          title: this.translateFunction('errors.unknown.title', 'common'),
          content: this.translateFunction('errors.unknown.message', 'common'),
        };
    }
  }
}
