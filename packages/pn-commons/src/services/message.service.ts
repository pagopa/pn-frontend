import { IAppMessage } from '../types/AppMessage';
import _ from 'lodash';

/**
 * This method get an http error code and return a formatted IAppMessage message.
 * @param  {{response:{status:number;};}} error
 * @returns IAppMessage
 */
export const createAppError = (error: { response: { status: number; data: { title: string} } }): IAppMessage => {
  const e: IAppMessage = {
    id: _.uniqueId(),
    title: '',
    message: '',
    status: 200,
    blocking: false,
    toNotify: true,
  };
  e.status = error.response?.status;
  if (error.response?.status === 404) {
    e.title = 'Risorsa non trovata';
    e.message = 'Si è verificato un errore. Si prega di riprovare più tardi';
  } else if (error.response?.status === 403) {
    e.title = 'La sessione è scaduta';
    e.message = "Entra e accedi con SPID o CIE.";
  } else if (error.response?.status === 401) {
    e.title = 'Utente non autorizzato';
    e.message = "L'utente corrente non ha le autorizzazioni";
  } else if (error.response?.status === 400 && error.response?.data?.title === "Delega già presente") {
    e.title = 'Delega già presente';
    e.message = "La persona che hai indicato ha già una delega per questo ente.";
  } else if (error.response?.status === 500 && error.response?.data?.title === "Errore generico") {
    e.title = 'Il servizio non è disponibile';
    e.message = "Per un problema temporaneo del servizio, la tua richiesta non è stata inviata. Riprova più tardi.";
  } else {
    e.title = 'Errore generico';
    e.message = 'Si è verificato un errore. Si prega di riprovare più tardi';
  }
  return e;
};

export const createAppMessage = (title: string, message: string, status?: number): IAppMessage => {
  const e: IAppMessage = {
    id: _.uniqueId(),
    title,
    message,
    blocking: false,
    toNotify: true,
    status,
  };
  return e;
};
