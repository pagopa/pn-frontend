import { getConfiguration } from '../services/configuration.service';

export const SELFCARE_ROUTE_LOGOUT = '/auth/logout';

export function goToLoginPortal() {
  const { SELFCARE_BASE_URL } = getConfiguration();
  const urlToRiderect = `${SELFCARE_BASE_URL}${SELFCARE_ROUTE_LOGOUT}`;
  // the indexOf check is to prevent xss attacks
  if (urlToRiderect.startsWith(SELFCARE_BASE_URL)) {
    window.open(`${urlToRiderect}`, '_self');
  }
}
