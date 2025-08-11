import { matchPath } from 'react-router-dom';

import { EventPageType, RapidAccess, sanitizeString } from '@pagopa-pn/pn-commons';

import {
  APP_STATUS,
  DELEGHE,
  DETTAGLIO_NOTIFICA,
  DETTAGLIO_NOTIFICA_DELEGATO,
  LOGOUT,
  NOTIFICHE,
  NOTIFICHE_DELEGATO,
  RECAPITI,
} from './routes.const';

export function goToLoginPortal(rapidAccess?: RapidAccess) {
  // eslint-disable-next-line functional/no-let
  let urlToRedirect = `${LOGOUT}`;
  // the startsWith check is to prevent xss attacks
  if (urlToRedirect.startsWith(LOGOUT) && rapidAccess) {
    // eslint-disable-next-line functional/immutable-data
    urlToRedirect += `?${rapidAccess.param}=${sanitizeString(rapidAccess.value)}`;
  }
  // the indexOf check is to prevent xss attacks
  if (urlToRedirect.startsWith(LOGOUT)) {
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