import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { ServerResponseError } from "../../types/AppError";
import AppError from "./AppError";

export class UnknownAppError extends AppError {
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "common",
        "errors.unknown.title",
        "Errore"
      ),
      message: getLocalizedOrDefaultLabel(
        "common",
        "errors.unknown.message",
        "Errore non previsto."
      )
    };
  }
}