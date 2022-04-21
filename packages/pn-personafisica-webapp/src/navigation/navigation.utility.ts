import { URL_FE_LOGIN } from '../utils/constants';

export function goToLogin() {
  /* eslint-disable functional/immutable-data */
  window.location.href = URL_FE_LOGIN || '';
}
