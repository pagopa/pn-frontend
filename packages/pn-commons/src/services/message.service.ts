import _ from 'lodash';

import { IAppMessage } from '../types';
import { getLocalizedOrDefaultLabel } from './localization.service';

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
 * This method localizes title and message of input error
 * @param  {IAppMessage} error
 * @param  {string} defaultTitle
 * @param  {string} defaultMessage
 */
const getErrorTitleAndMessage = (error: IAppMessage, defaultTitle: string, defaultMessage: string) => {
  error.title = getLocalizedOrDefaultLabel('common', `messages.${error.status}-title`, defaultTitle);
  error.message = getLocalizedOrDefaultLabel('common', `messages.${error.status}-message`, defaultMessage);
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
    getErrorTitleAndMessage(e, 'Risorsa non trovata', 'Si è verificato un errore. Si prega di riprovare più tardi')
  } else if (error.response?.status === 403) {
    getErrorTitleAndMessage(e, 'La sessione è scaduta', 'Entra e accedi con SPID o CIE.')
  } else if (error.response?.status === 401) {
    getErrorTitleAndMessage(e, 'Utente non autorizzato', "L'utente corrente non ha le autorizzazioni")
  } else if (error.response?.status === 500) {
    getErrorTitleAndMessage(e, 'Il servizio non è disponibile', 'Per un problema temporaneo del servizio, la tua richiesta non è stata inviata. Riprova più tardi.')
  } else {
    e.title = getLocalizedOrDefaultLabel('common', `messages.generic-title`, 'Errore generico');
    e.message = getLocalizedOrDefaultLabel('common', `messages.generic-message`, 'Si è verificato un errore. Si prega di riprovare più tardi');
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
