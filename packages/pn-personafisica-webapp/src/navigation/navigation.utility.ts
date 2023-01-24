import { sanitizeString } from '@pagopa-pn/pn-commons';

import { URL_FE_LOGOUT } from '../utils/constants';

export function goToLoginPortal(type: 'PG' | 'PF', aarToken?: string | null) {
  /* eslint-disable functional/no-let */
  /* eslint-disable functional/immutable-data */
  let urlToRiderect = `${URL_FE_LOGOUT}?type=${type}`;
  // the startsWith check is to prevent xss attacks
  if (urlToRiderect.startsWith(URL_FE_LOGOUT) && aarToken) {
    urlToRiderect += `&aar=${sanitizeString(aarToken)}`;
  }
  // the indexOf check is to prevent xss attacks
  if (urlToRiderect.startsWith(URL_FE_LOGOUT)) {
    window.location.replace(`${urlToRiderect}`);
  }
}
