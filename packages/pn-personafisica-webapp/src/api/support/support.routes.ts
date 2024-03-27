import { compileRoute } from '@pagopa-pn/pn-commons';

// Segments
const API_SUPPORT_AUTHORIZATION_BASE = 'zendesk-authorization';
const API_NEW_SUPPORT_REQUEST = 'new-support-request';

// Paths
const API_SUPPORT_AUTHORIZATION_PATH = `${API_SUPPORT_AUTHORIZATION_BASE}/${API_NEW_SUPPORT_REQUEST}`;

// APIs
export function ZENDESK_AUTHORIZATION() {
  return compileRoute({
    prefix: '',
    path: API_SUPPORT_AUTHORIZATION_PATH,
  });
}
