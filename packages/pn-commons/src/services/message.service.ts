import { IAppMessage } from '../types/AppMessage';
import _ from 'lodash';

/**
 * This method get an http error code and return a formatted IAppMessage message.
 * @param  {{response:{status:number;};}} error
 * @returns IAppMessage
 */
export const createAppError = (error: { response: { status: number } }): IAppMessage => {
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
