import { getConfiguration } from '../services/configuration.service';

export function goToSelfcareLogin(): void {
  /* eslint-disable functional/immutable-data */
  const { SELFCARE_URL_FE_LOGIN } = getConfiguration();
  window.open(SELFCARE_URL_FE_LOGIN, '_self');
}
