import { matchPath } from 'react-router-dom';

import { EventPageType } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';
import {
  APP_STATUS,
  DASHBOARD,
  DETTAGLIO_NOTIFICA,
  NUOVA_NOTIFICA,
  SELFCARE_LOGIN_PATH,
  SELFCARE_LOGOUT_GOOGLE_PATH,
  SELFCARE_LOGOUT_PATH,
} from './routes.const';

export function goToSelfcareLogin(): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  window.open(`${SELFCARE_BASE_URL}${SELFCARE_LOGIN_PATH}`, '_self');
}

export function goToSelfcareLogout(isSupportUser: boolean): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  const logoutPath = isSupportUser ? SELFCARE_LOGOUT_GOOGLE_PATH : SELFCARE_LOGOUT_PATH;
  window.open(`${SELFCARE_BASE_URL}${logoutPath}`, '_self');
}

/**
 * This method returns an EventPageType used to track user experience base on current location.
 * In this way, we avoid to share current url and therfore personal information.
 * @param location
 * @returns EventPageType | undefined
 */
export const getCurrentEventTypePage = (location: string): EventPageType | undefined => {
  if (matchPath({ path: DETTAGLIO_NOTIFICA }, location)) {
    return EventPageType.DETTAGLIO_NOTIFICA;
  }

  if (matchPath({ path: DASHBOARD }, location) || matchPath({ path: NUOVA_NOTIFICA }, location)) {
    return EventPageType.LISTA_NOTIFICHE;
  }

  if (matchPath({ path: APP_STATUS }, location)) {
    return EventPageType.STATUS_PAGE;
  }

  if (matchPath({ path: '/' }, location)) {
    return EventPageType.ROOT_PAGE;
  }

  return undefined;
};
