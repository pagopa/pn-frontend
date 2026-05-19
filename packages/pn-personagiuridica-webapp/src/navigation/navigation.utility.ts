import { sanitizeString } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';
import { SELFCARE_LOGOUT } from './routes.const';

type GoToLoginProps = {
  search?: string;
};

export function goToLoginPortal({ search = '' }: GoToLoginProps = {}) {
  const { SELFCARE_BASE_URL } = getConfiguration();
  // eslint-disable-next-line functional/no-let
  let urlToRedirect = `${SELFCARE_BASE_URL}${SELFCARE_LOGOUT}`;

  // the startsWith check is to prevent xss attacks
  if (urlToRedirect.startsWith(SELFCARE_BASE_URL)) {
    const currentParams = new URLSearchParams(search);
    const filteredParams = new URLSearchParams();

    // keep utm_* params
    currentParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        filteredParams.set(key, sanitizeString(value));
      }
    });

    const query = filteredParams.toString();
    if (query) {
      urlToRedirect += `?${query}`;
    }

    window.open(`${urlToRedirect}`, '_self');
  }
}
