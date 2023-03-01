import {
  AppError,
  AppErrorFactory,
  ServerResponseError,
  UnknownAppError,
} from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterAppError } from './GenericInvalidParameterAppError';
import { ServerResponseErrorCode } from './types';

export class PAAppErrorFactory extends AppErrorFactory {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(translateFunction: (path: string, ns: string) => string) {
    super();
    this.translateFunction = translateFunction;
  }

  protected getCustomError: (error: ServerResponseError) => AppError = (
    error: ServerResponseError
  ) => {
    switch (error.code) {
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER:
        return new GenericInvalidParameterAppError(error, this.translateFunction);
      default:
        return new UnknownAppError(error);
    }
  };
}
