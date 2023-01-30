import { AppRouteType, sanitizeString, AppRouteParams } from '@pagopa-pn/pn-commons';

import { URL_FE_LOGOUT } from '../utils/constants';

export function goToLoginPortal(type: AppRouteType.PF | AppRouteType.PG, aarToken?: string | null) {
  /* eslint-disable functional/no-let */
  /* eslint-disable functional/immutable-data */
  let urlToRiderect = `${URL_FE_LOGOUT}?${AppRouteParams.TYPE}=${type}`;
  // the startsWith check is to prevent xss attacks
  if (urlToRiderect.startsWith(URL_FE_LOGOUT) && aarToken) {
    urlToRiderect += `&${AppRouteParams.AAR}=${sanitizeString(aarToken)}`;
  }
  // the indexOf check is to prevent xss attacks
  if (urlToRiderect.startsWith(URL_FE_LOGOUT)) {
    window.location.replace(`${urlToRiderect}`);
  }
}
