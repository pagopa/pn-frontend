import { matchPath } from 'react-router-dom';

import { AppRouteParams, EventPageType, sanitizeString } from '@pagopa-pn/pn-commons';

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

export function goToLoginPortal(queryString?: string) {
  // eslint-disable-next-line functional/no-let
  let urlToRedirect = `${LOGOUT}`;
  // the startsWith check is to prevent xss attacks
  if (urlToRedirect.startsWith(LOGOUT) && queryString) {
    // eslint-disable-next-line functional/immutable-data
    urlToRedirect += `?${queryString}`;
  }
  // the indexOf check is to prevent xss attacks
  if (urlToRedirect.startsWith(LOGOUT)) {
    window.open(`${urlToRedirect}`, '_self');
  }
}

export function goToLoginPortalWithParams(params: URLSearchParams) {
  // eslint-disable-next-line functional/no-let
  let queryString = '';
  const aar = params.get(AppRouteParams.AAR);
  const tpp = params.get(AppRouteParams.RETRIEVAL_ID);
  if (aar) {
    queryString = `${AppRouteParams.AAR}=${sanitizeString(aar)}`;
  } else if (tpp) {
    queryString = `${AppRouteParams.RETRIEVAL_ID}=${sanitizeString(tpp)}`;
  }
  goToLoginPortal(queryString);
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
