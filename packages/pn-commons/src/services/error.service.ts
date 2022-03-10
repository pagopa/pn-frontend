import { AppError } from '../types/AppError';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * This method get an http error code and return a formatted AppError message.
 * If you want to provide translations for messages you have to provide a file with namespace equal to 'errors'
 * @param  {{response:{status:number;};}} error
 * @returns AppError
 */
export const createAppError = (error: { response: { status: number } }): AppError => {
  const { t } = useTranslation('error');
  const e: AppError = {
    id: _.uniqueId(),
    title: '',
    message: '',
    blocking: false,
    toNotify: true,
  };
  if (error.response?.status === 404) {
    e.title = t('Risorsa non trovata');
    e.message = t('Si è verificato un errore. Si prega di riprovare più tardi');
  } else if (error.response?.status === 403) {
    e.title = t('Utente non autenticato');
    e.message = t("L'utente corrente non è autenticato");
  } else {
    e.title = t('Errore generico');
    e.message = t('Si è verificato un errore. Si prega di riprovare più tardi');
  }
  return e;
};
