import { getConfiguration } from '../services/configuration.service';
import { SELFCARE_LOGOUT_PATH } from './routes.const';

export function goToSelfcareLogout(): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  window.open(`${SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`, '_self');
}
