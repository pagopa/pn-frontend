import { getLocalizedOrDefaultLabel } from "../../../services/localization.service";
import { ServerResponseError } from "../../../types/AppResponse";
import AppError from "../AppError";

export class UnhandledAppError extends AppError {

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "common",
        "errors.unhandled.title",
        "Errore generico"
      ),
      content: getLocalizedOrDefaultLabel(
        "common",
        "errors.unhandled.message",
        "Si è verificato un errore. Si prega di riprovare più tardi."
      )
    };
  }
}