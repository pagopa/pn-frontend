import { getConfiguration } from '../services/configuration.service';

export function goToSelfcareLogin(): void {
  /* eslint-disable functional/immutable-data */
  const { SELFCARE_URL_FE_LOGIN } = getConfiguration();
  console.log('Redirecting to Selfcare Login:', SELFCARE_URL_FE_LOGIN);
  /* eslint-enable functional/immutable-data */
  window.open(SELFCARE_URL_FE_LOGIN, '_self');
}

export function goToSelfcareLogout(): void {
  /* eslint-disable functional/immutable-data */
  const { SELFCARE_URL_FE_LOGOUT } = getConfiguration();
  console.log('Redirecting to Selfcare Logout:', SELFCARE_URL_FE_LOGOUT);
  /* eslint-enable functional/immutable-data */
  window.open(SELFCARE_URL_FE_LOGOUT, '_self');
}