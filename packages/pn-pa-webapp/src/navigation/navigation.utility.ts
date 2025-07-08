import { getConfiguration } from '../services/configuration.service';
import { SELFCARE_LOGIN_PATH, SELFCARE_LOGOUT_PATH } from './routes.const';

export function goToSelfcareLogin(): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  window.open( `${SELFCARE_BASE_URL}${SELFCARE_LOGIN_PATH}`, '_self');
}

export function goToSelfcareLogout(): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  window.open(`${SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`, '_self');
}