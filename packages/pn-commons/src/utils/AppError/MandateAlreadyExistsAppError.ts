import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { ServerResponseError } from "../../types/AppError";
import AppError from "./AppError";

export class MandateAlreadyExistsAppError extends AppError {
  
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.already_exists.title",
        "Errore"
      ),
      message: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.already_exists.message",
        "La persona che hai indicato ha già una delega per questo ente."
      )
    };
  }
}