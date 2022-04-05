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
    blocking: false,
    toNotify: true,
  };
  if (error.response?.status === 404) {
    e.title = 'Risorsa non trovata';
    e.message = 'Si è verificato un errore. Si prega di riprovare più tardi';
  } else if (error.response?.status === 403) {
    e.title = 'Utente non autenticato';
    e.message = "L'utente corrente non è autenticato";
  } else {
    e.title = 'Errore generico';
    e.message = 'Si è verificato un errore. Si prega di riprovare più tardi';
  }
  return e;
};

export const createAppMessage = (title: string, message: string): IAppMessage => {
  const e: IAppMessage = {
    id: _.uniqueId(),
    title,
    message,
    blocking: false,
    toNotify: true,
  };
  return e;
};

