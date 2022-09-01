import { URL_FE_LOGIN } from '../utils/constants';

export function goToLogin(pathname?: string) {
  const baseUrl = URL_FE_LOGIN ?? '';
  if (pathname) {
    const encodedPathname = encodeURIComponent(pathname);

    /* eslint-disable functional/immutable-data */
    window.location.href = baseUrl + 'login' + `?path=${encodedPathname}`;
  } else {
    window.location.href = baseUrl;
  }
}
