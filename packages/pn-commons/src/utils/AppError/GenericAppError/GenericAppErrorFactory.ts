import { ServerResponseErrorCode } from "../../../types/AppError";
import AppError from "../AppError";
import { ForbiddenAppError } from "./ForbiddenAppError";
import { InternalServerAppError } from "./InternalServerError";
import { NotFoundAppError } from "./NotFoundAppError";
import { UnauthorizedAppError } from "./UnauthorizedAppError";
import { UnhandledAppError } from "./UnhandledAppError";

class GenericAppErrorFactory {
  static create(status: number): AppError {
    // switch (error.status) {
    switch (status) {
    case 401 || "401":
        return new UnauthorizedAppError({ code: ServerResponseErrorCode.UNAUTHORIZED_ERROR });
      case 403 || "403":
        return new ForbiddenAppError({ code: ServerResponseErrorCode.FORBIDDEN_ERROR });
      case 404 || "404":
        return new NotFoundAppError({ code: ServerResponseErrorCode.NOT_FOUND_ERROR });
      case 500 || "500":
        return new InternalServerAppError({ code: ServerResponseErrorCode.INTERNAL_SERVER_ERROR });
      default:
        return new UnhandledAppError({ code: ServerResponseErrorCode.UNHANDLED_ERROR });
    }
  }
}

export default GenericAppErrorFactory;