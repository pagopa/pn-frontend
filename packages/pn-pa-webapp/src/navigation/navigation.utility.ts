import { getConfiguration } from '../services/configuration.service';

export function goToSelfcareLogin(): void {
  const { SELFCARE_URL_FE_LOGIN } = getConfiguration();
  window.open(SELFCARE_URL_FE_LOGIN, '_self');
}

export function goToSelfcareLogout(): void {
  const { SELFCARE_URL_FE_LOGOUT } = getConfiguration();
  window.open(SELFCARE_URL_FE_LOGOUT, '_self');
}