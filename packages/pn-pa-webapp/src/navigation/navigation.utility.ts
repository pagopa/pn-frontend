import { SELFCARE_URL_FE_LOGIN } from '../utils/constants';

export function goToSelfcareLogin(): void {
  /* eslint-disable functional/immutable-data */
  window.location.href = SELFCARE_URL_FE_LOGIN || '';
}
