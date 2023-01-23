import { URL_FE_LOGOUT } from '../utils/constants';

export function goToLoginPortal(type: 'PG' | 'PF') {
  /* eslint-disable functional/immutable-data */
  window.location.replace(`${URL_FE_LOGOUT}?type=${type}`);
}
