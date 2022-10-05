import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { ServerResponseError } from "../../types/AppResponse";
import AppError from "./AppError";

export class MandateNotAcceptableAppError extends AppError {
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.not_acceptable.title",
        "Errore"
      ),
      content: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.not_acceptable.message",
        "Delega non inseribile."
      )
    };
  }
}