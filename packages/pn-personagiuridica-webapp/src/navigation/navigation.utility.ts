import { getConfiguration } from '../services/configuration.service';

export function goToLoginPortal() {
  const { URL_FE_LOGOUT } = getConfiguration();
  const urlToRiderect = `${URL_FE_LOGOUT}`;
  // the indexOf check is to prevent xss attacks
  if (urlToRiderect.startsWith(URL_FE_LOGOUT)) {
    window.location.replace(`${urlToRiderect}`);
  }
}
