import { compileRoute } from '@pagopa-pn/pn-commons';

// Segments
const API_AUTH_TOKEN_EXCHANGE = 'token-exchange';
const API_AUTH_LOGOUT = 'logout';

// APIs
export function AUTH_TOKEN_EXCHANGE() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_TOKEN_EXCHANGE,
  });
}

export function AUTH_LOGOUT() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_LOGOUT,
  });
}
