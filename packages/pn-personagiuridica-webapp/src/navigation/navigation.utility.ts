import { getConfiguration } from '../services/configuration.service';
import { SELFCARE_LOGOUT } from './routes.const';

export function goToLoginPortal() {
  const { SELFCARE_BASE_URL } = getConfiguration();
  const urlToRiderect = `${SELFCARE_BASE_URL}${SELFCARE_LOGOUT}`;
  // the indexOf check is to prevent xss attacks
  if (urlToRiderect.startsWith(SELFCARE_BASE_URL)) {
    window.open(`${urlToRiderect}`, '_self');
  }
}
