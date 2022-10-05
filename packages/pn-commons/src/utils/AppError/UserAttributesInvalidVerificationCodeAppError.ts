import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { ServerResponseError } from "../../types/AppResponse";
import AppError from "./AppError";

export class UserAttributesInvalidVerificationCodeAppError extends AppError {

  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "contacts",
        "errors.invalid_verification_code.title",
        "Il codice inserito non è corretto"
      ),
      content: getLocalizedOrDefaultLabel(
        "contacts",
        "errors.invalid_verification_code.message",
        "Prova a reinserirlo, oppure genera un nuovo codice."
      )
    };
  }
}