import { compileRoute } from '@pagopa-pn/pn-commons';

// Segments
const API_AUTH_LOGOUT = 'logout';

// APIs
export function AUTH_LOGOUT() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_LOGOUT,
  });
}
