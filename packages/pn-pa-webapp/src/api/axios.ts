import axios, { AxiosError } from 'axios';
import _ from 'lodash';

import { AppError } from '@pagopa-pn/pn-commons/src/types/AppError';

export const authClient = axios.create({
  baseURL: process.env.REACT_APP_AUTH_BASE_URL,
});

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
});

apiClient.interceptors.request.use(
  (config) => {
    /* eslint-disable functional/immutable-data */
    const token = JSON.parse(sessionStorage.getItem('user') || '');
    if (token && config.headers) {
      config.headers.Authorization = 'Bearer ' + (token.sessionToken as string);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError): AppError => {
    const e: AppError = {
      id: _.uniqueId(),
      title: '',
      message: '',
      blocking: false,
      toNotify: true
    };
    if (error.response?.status === 404) {
      e.title = 'Risorsa non trovata';
      e.message = 'Si è verificato un errore. Si prega di riprovare più tardi';
    } else if (error.response?.status === 403) {
      e.title = 'Utente non autenticato';
      e.message = 'L\'utente corrente non è autenticato';
    } else {
      e.title = 'Errore generico';
      e.message = 'Si è verificato un errore. Si prega di riprovare più tardi';
    }
    throw e;
  }
);
