import { AppErrorDetail, AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

export class DefaultAppError extends AppError {
  type = AppErrorTypes.DEFAULT;

  constructor(error: AppErrorDetail) {
    super(error);
  }

  getMessage() {
    return {
      title: "Il servizio non è disponibile",
      message: "Per un problema temporaneo del servizio, la tua richiesta non è stata inviata. Riprova più tardi."
    };
  }
}