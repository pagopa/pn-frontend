import { URL_FE_LOGIN } from '../utils/constants';

export function goToLoginPortal(origin: string, login=true) {
  const baseUrl = URL_FE_LOGIN ?? '';
  const encodedPathname = encodeURIComponent(origin);

  /* eslint-disable functional/immutable-data */
  window.location.replace(baseUrl + (login ? 'login' : 'logout') + `?origin=${encodedPathname}`);
}
