import {
  HTTPStatusCode,
  ServerResponseError,
} from "../../types/AppResponse";
import AppError from "./AppError";
import UnknownAppError from "./UnknownAppError";
import GenericAppErrorFactory from "./GenericAppError/GenericAppErrorFactory";

class AppErrorFactory {
  protected getCustomError: (error: ServerResponseError) => AppError = (error: ServerResponseError) => new UnknownAppError(error);

  public create(error: ServerResponseError | HTTPStatusCode): AppError {
    if(typeof error !== 'object') {
      return GenericAppErrorFactory.create(error);
    }

    return this.getCustomError(error);
  }
}

export default AppErrorFactory;