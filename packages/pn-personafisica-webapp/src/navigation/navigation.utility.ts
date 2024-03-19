import { matchPath } from 'react-router-dom';

import { AppRouteParams, EventPageType, sanitizeString } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';
import {
  APP_STATUS,
  DELEGHE,
  DETTAGLIO_NOTIFICA,
  DETTAGLIO_NOTIFICA_DELEGATO,
  NOTIFICHE,
  NOTIFICHE_DELEGATO,
  RECAPITI,
} from './routes.const';

export function goToLoginPortal(aarToken?: string | null) {
  const { URL_FE_LOGOUT } = getConfiguration();
  // eslint-disable-next-line functional/no-let
  let urlToRiderect = `${URL_FE_LOGOUT}`;
  // the startsWith check is to prevent xss attacks
  if (urlToRiderect.startsWith(URL_FE_LOGOUT) && aarToken) {
    // eslint-disable-next-line functional/immutable-data
    urlToRiderect += `?${AppRouteParams.AAR}=${sanitizeString(aarToken)}`;
  }
  // the indexOf check is to prevent xss attacks
  if (urlToRiderect.startsWith(URL_FE_LOGOUT)) {
    window.open(`${urlToRiderect}`, '_self');
  }
}

/**
 * This method returns an EventPageType used to track user experience base on current location.
 * In this way, we avoid to share current url and therfore personal information.
 * @param location
 * @returns EventPageType | undefined
 */
export const getCurrentEventTypePage = (location: string): EventPageType | undefined => {
  // eslint-disable-next-line functional/no-let
  let pageType: EventPageType | undefined;
  if (
    matchPath({ path: DETTAGLIO_NOTIFICA }, location) ||
    matchPath({ path: DETTAGLIO_NOTIFICA_DELEGATO }, location)
  ) {
    pageType = EventPageType.DETTAGLIO_NOTIFICA;
  } else if (
    matchPath({ path: NOTIFICHE }, location) ||
    matchPath({ path: NOTIFICHE_DELEGATO }, location)
  ) {
    pageType = EventPageType.LISTA_NOTIFICHE;
  } else if (matchPath({ path: DELEGHE }, location)) {
    pageType = EventPageType.LISTA_DELEGHE;
  } else if (matchPath({ path: RECAPITI }, location)) {
    pageType = EventPageType.RECAPITI;
  } else if (matchPath({ path: APP_STATUS }, location)) {
    pageType = EventPageType.STATUS_PAGE;
  } else if (matchPath({ path: '/' }, location)) {
    pageType = EventPageType.ROOT_PAGE;
  }

  return pageType;
};
