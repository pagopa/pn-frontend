import { matchPath } from 'react-router-dom';

import { EventPageType, sanitizeString } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';
import {
  APP_STATUS,
  DELEGATI,
  DELEGHE,
  DELEGHEACARICO,
  DETTAGLIO_NOTIFICA,
  DETTAGLIO_NOTIFICA_DELEGATO,
  DIGITAL_DOMICILE,
  DIGITAL_DOMICILE_ACTIVATION,
  DIGITAL_DOMICILE_MANAGEMENT,
  NOTIFICHE,
  NOTIFICHE_DELEGATO,
  NUOVA_DELEGA,
  RECAPITI,
  SELFCARE_LOGOUT,
} from './routes.const';

type GoToLoginProps = {
  search?: string;
};

export function goToLoginPortal({ search = '' }: GoToLoginProps = {}) {
  const { SELFCARE_BASE_URL } = getConfiguration();
  // eslint-disable-next-line functional/no-let
  let urlToRedirect = `${SELFCARE_BASE_URL}${SELFCARE_LOGOUT}`;

  // the startsWith check is to prevent xss attacks
  if (urlToRedirect.startsWith(SELFCARE_BASE_URL)) {
    const currentParams = new URLSearchParams(search);
    const filteredParams = new URLSearchParams();

    // keep utm_* params
    currentParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        filteredParams.set(key, sanitizeString(value));
      }
    });

    const query = filteredParams.toString();
    if (query) {
      urlToRedirect += `?${query}`;
    }

    window.open(`${urlToRedirect}`, '_self');
  }
}

/**
 * This method returns an EventPageType used to track user experience base on current location.
 * In this way, we avoid to share current url and therfore personal information.
 * @param location
 * @returns EventPageType | undefined
 */
export const getCurrentEventTypePage = (location: string): EventPageType | undefined => {
  if (
    matchPath({ path: DETTAGLIO_NOTIFICA }, location) ||
    matchPath({ path: DETTAGLIO_NOTIFICA_DELEGATO }, location)
  ) {
    return EventPageType.DETTAGLIO_NOTIFICA;
  }

  if (
    matchPath({ path: NOTIFICHE }, location) ||
    matchPath({ path: NOTIFICHE_DELEGATO }, location)
  ) {
    return EventPageType.LISTA_NOTIFICHE;
  }

  if (
    matchPath({ path: DELEGHE }, location) ||
    matchPath({ path: `${DELEGHEACARICO}` }, location) ||
    matchPath({ path: `${DELEGATI}` }, location) ||
    matchPath({ path: `${NUOVA_DELEGA}` }, location)
  ) {
    return EventPageType.LISTA_DELEGHE;
  }

  if (
    matchPath({ path: RECAPITI }, location) ||
    matchPath({ path: DIGITAL_DOMICILE }, location) ||
    matchPath({ path: `${DIGITAL_DOMICILE_ACTIVATION}` }, location) ||
    matchPath({ path: `${DIGITAL_DOMICILE_MANAGEMENT}` }, location)
  ) {
    return EventPageType.RECAPITI;
  }

  if (matchPath({ path: APP_STATUS }, location)) {
    return EventPageType.STATUS_PAGE;
  }

  if (matchPath({ path: '/' }, location)) {
    return EventPageType.ROOT_PAGE;
  }

  return undefined;
};
