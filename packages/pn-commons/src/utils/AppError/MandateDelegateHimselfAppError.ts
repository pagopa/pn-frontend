import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { ServerResponseError } from "../../types/AppError";
import AppError from "./AppError";

export class MandateDelegateHimselfAppError extends AppError {

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.delegate_himself.title",
        "Errore"
      ),
      message: getLocalizedOrDefaultLabel(
        "delegations",
        "errors.delegate_himself.message",
        "Non è possibile delegare se stessi!"
      )
    };
  }
}