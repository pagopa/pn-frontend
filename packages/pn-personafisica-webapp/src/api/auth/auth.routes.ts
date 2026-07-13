import { compileRoute } from '@pagopa-pn/pn-commons';

// Segments
const API_AUTH_TOKEN_EXCHANGE = 'token-exchange';
const API_AUTH_ONE_IDENTITY_TOKEN_EXCHANGE = 'oidc/token';
const API_AUTH_FIMS_TOKEN_EXCHANGE = 'fims/exchange';
const API_AUTH_LOGOUT = 'logout';

// APIs
export function AUTH_TOKEN_EXCHANGE() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_TOKEN_EXCHANGE,
  });
}

export function FIMS_TOKEN_EXCHANGE() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_FIMS_TOKEN_EXCHANGE,
  });
}

export function ONE_IDENTITY_TOKEN_EXCHANGE() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_ONE_IDENTITY_TOKEN_EXCHANGE,
  });
}

export function AUTH_LOGOUT() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_LOGOUT,
  });
}
