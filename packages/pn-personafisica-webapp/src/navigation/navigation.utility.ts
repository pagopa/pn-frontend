// import { URL_FE_LOGIN } from '../utils/constants';

export function goToLoginPortal(origin: string) {
  // const baseUrl = URL_FE_LOGIN ?? '';
  const encodedPathname = encodeURIComponent(origin);
  console.log("origin",origin);

  /* eslint-disable functional/immutable-data */
  window.location.replace('http://localhost:3000/' + 'logout' + `?origin=${encodedPathname}`);
}
