import { defer, matchPath } from 'react-router-dom';

import {
  AppRouteParams,
  EventPageType,
  GetNotificationsResponse,
  Notification,
  sanitizeString,
} from '@pagopa-pn/pn-commons';

import { LoginProvider } from '../models/User';
import { getDigitalAddresses } from '../redux/contact/actions';
import { SelectedAddresses, contactsSelectors } from '../redux/contact/reducers';
import { getReceivedNotifications } from '../redux/dashboard/actions';
import { setFirstSearch } from '../redux/dashboard/reducers';
import { store } from '../redux/store';
import {
  APP_STATUS,
  DELEGHE,
  DETTAGLIO_NOTIFICA,
  DETTAGLIO_NOTIFICA_DELEGATO,
  LOGOUT,
  LOGOUT_OI,
  NOTIFICHE,
  NOTIFICHE_DELEGATO,
  RECAPITI,
} from './routes.const';

type GoToLoginProps = {
  loginProvider: LoginProvider;
  rapidAccess?: [AppRouteParams, string];
  search?: string;
};

export type OnboardingLoaderData = {
  addresses: SelectedAddresses;
  notifications: Array<Notification>;
};

export function goToLoginPortal({ rapidAccess, loginProvider, search = '' }: GoToLoginProps) {
  const logoutPath = loginProvider === LoginProvider.ONEIDENTITY ? `${LOGOUT_OI}` : `${LOGOUT}`;

  // eslint-disable-next-line functional/no-let
  let urlToRedirect = `${logoutPath}`;
  // the startsWith check is to prevent xss attacks
  if (urlToRedirect.startsWith(logoutPath)) {
    const currentParams = new URLSearchParams(search);
    const filteredParams = new URLSearchParams();

    // keep utm_* params
    currentParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        filteredParams.set(key, sanitizeString(value));
      }
    });

    // ensure rapid access param is present and sanitized
    if (rapidAccess) {
      filteredParams.set(rapidAccess[0], sanitizeString(rapidAccess[1]));
    }

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

function waitForSessionToken(): Promise<void> {
  if (store.getState().userState.user.sessionToken) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    const unsubscribe = store.subscribe(() => {
      if (store.getState().userState.user.sessionToken) {
        unsubscribe();
        resolve();
      }
    });
  });
}

async function fetchOnboardingData(): Promise<OnboardingLoaderData> {
  await waitForSessionToken();

  const [, notificationsResult] = await Promise.all([
    store.dispatch(getDigitalAddresses()),
    store.dispatch(getReceivedNotifications({ size: 10 })),
  ]);

  store.dispatch(setFirstSearch(true));

  return {
    addresses: contactsSelectors.selectAddresses(store.getState()),
    notifications: (notificationsResult.payload as GetNotificationsResponse).resultsPage ?? [],
  };
}

export const onboardingLoader = () => defer({ data: fetchOnboardingData() });
