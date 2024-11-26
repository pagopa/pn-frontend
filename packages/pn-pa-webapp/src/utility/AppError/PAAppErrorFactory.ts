import {
  AppError,
  AppErrorFactory,
  ServerResponseError,
  UnknownAppError,
} from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterAppError } from './GenericInvalidParameterAppError';
import { GenericInvalidParameterDuplicateAppError } from './GenericInvalidParameterDuplicateAppError';
import { ServerResponseErrorCode } from './types';
import { GenericInvalidParameterTaxonomyCodeAppError } from './GenericInvalidParameterTaxonomyCodeAppError';

export class PAAppErrorFactory extends AppErrorFactory {
  private translateFunction: (path: string, ns: string) => string;

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
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_DUPLICATED:
        return new GenericInvalidParameterDuplicateAppError(error, this.translateFunction);
      case ServerResponseErrorCode.PN_GENERIC_INVALIDPARAMETER_TAXONOMYCODE:
        return new GenericInvalidParameterTaxonomyCodeAppError(error, this.translateFunction);
      default:
        return new UnknownAppError(error);
    }
  };
}
