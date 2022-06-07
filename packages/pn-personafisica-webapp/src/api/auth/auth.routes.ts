import { compileRoute } from '@pagopa-pn/pn-commons';

// Segments
const API_AUTH_TOKEN_EXCHANGE = 'token-exchange';

// APIs
export function AUTH_TOKEN_EXCHANGE() {
  return compileRoute({
    prefix: '',
    path: API_AUTH_TOKEN_EXCHANGE,
  });
}
