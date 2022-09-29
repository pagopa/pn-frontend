import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { ServerResponseError } from "../../types/AppResponse";
import AppError from "./AppError";

export class MandateNotFoundAppError extends AppError {
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.invalid_verification_code.title",
        "Errore"
      ),
      message: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.invalid_verification_code.message",
        "Delega non trovata."
      )
    };
  }
}