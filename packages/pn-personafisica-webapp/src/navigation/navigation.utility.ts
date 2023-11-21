import { AppRouteParams, sanitizeString } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

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
    window.location.replace(`${urlToRiderect}`);
  }
}
