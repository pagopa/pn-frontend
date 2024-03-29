import { HTTPStatusCode, ServerResponseError } from '../../models/AppResponse';
import AppError from './AppError';
import GenericAppErrorFactory from './GenericAppError/GenericAppErrorFactory';
import UnknownAppError from './UnknownAppError';

class AppErrorFactory {
  protected getCustomError: (error: ServerResponseError) => AppError = (
    error: ServerResponseError
  ) => new UnknownAppError(error);

  public create(error: ServerResponseError | HTTPStatusCode): AppError {
    if (typeof error !== 'object') {
      return GenericAppErrorFactory.create(error);
    }

    return this.getCustomError(error);
  }
}

export default AppErrorFactory;
