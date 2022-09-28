import { getLocalizedOrDefaultLabel } from "../../../services/localization.service";
import { ServerResponseError } from "../../../types/AppError";
import AppError from "../AppError";

export class ForbiddenAppError extends AppError {

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "common",
        "errors.forbidden.title",
        "La sessione è scaduta"
      ),
      message: getLocalizedOrDefaultLabel(
        "common",
        "errors.forbidden.message",
        "Entra e accedi con SPID o CIE."
      )
    };
  }
}