import { AppErrorDetail } from "../../../types/AppError";
import { AppError } from "../AppError";
import { ForbiddenAppError } from "./ForbiddenAppError";
import { InternalServerAppError } from "./InternalServerError";
import { NotFoundAppError } from "./NotFoundAppError";
import { UnauthorizedAppError } from "./UnauthorizedAppError";
import { UnhandledAppError } from "./UnhandledAppError";

class GenericAppErrorFactory {
  static create(error: AppErrorDetail): AppError {
    switch (error.status) {
      case 401 || "401":
        return new UnauthorizedAppError(error);
      case 403 || "403":
        return new ForbiddenAppError(error);
      case 404 || "404":
        return new NotFoundAppError(error);
      case 500 || "500":
        return new InternalServerAppError(error);
      default:
        return new UnhandledAppError(error);
    }
  }
}

export default GenericAppErrorFactory;