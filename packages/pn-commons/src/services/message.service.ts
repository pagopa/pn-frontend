import _ from 'lodash';
import { IAppMessage } from '../types/AppMessage';

interface IAppErrorProps {
  response: {
    status: number;
    customMessage?: {
      title: string;
      message: string;
    };
  };
}

/**
 * This method get an http error code and an optional custom message as params and return a formatted IAppMessage message.
 * If customMessage is set than its title and message fields are used into the returned IAppMessage message otherwise a 
 * default title and message body are set based on the message status
 * @param  {IAppErrorProps} error
 * @returns IAppMessage
 */
export const createAppError = (error: IAppErrorProps): IAppMessage => {
  const e: IAppMessage = {
    id: _.uniqueId(),
    title: '',
    message: '',
    status: 200,
    blocking: false,
    toNotify: true,
  };
  e.status = error.response?.status;
  if (error.response?.customMessage) {
    e.title = error.response.customMessage.title;
    e.message = error.response.customMessage.message;
  } else if (error.response?.status === 404) {
    e.title = 'Risorsa non trovata';
    e.message = 'Si è verificato un errore. Si prega di riprovare più tardi';
  } else if (error.response?.status === 403) {
    e.title = 'La sessione è scaduta';
    e.message = "Entra e accedi con SPID o CIE.";
  } else if (error.response?.status === 401) {
    e.title = 'Utente non autorizzato';
    e.message = "L'utente corrente non ha le autorizzazioni";
  } else if (error.response?.status === 500) {
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
