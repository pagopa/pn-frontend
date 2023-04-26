import { getConfiguration } from '../services/configuration.service';

export function goToSelfcareLogin(): void {
  /* eslint-disable functional/immutable-data */
  window.location.href = getConfiguration().SELFCARE_URL_FE_LOGIN || '';
}
