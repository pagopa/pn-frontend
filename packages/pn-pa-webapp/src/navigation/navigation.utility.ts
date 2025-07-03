import { getConfiguration } from '../services/configuration.service';

export const SELFCARE_LOGIN_PATH = '/auth/login';
export const SELFCARE_LOGOUT_PATH = '/auth/logout';

export function goToSelfcareLogin(): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  window.open( `${SELFCARE_BASE_URL}${SELFCARE_LOGIN_PATH}`, '_self');
}

export function goToSelfcareLogout(): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  window.open(`${SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`, '_self');
}