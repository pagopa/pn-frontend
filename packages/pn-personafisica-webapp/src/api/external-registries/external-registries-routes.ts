import { compileRoute } from '@pagopa-pn/pn-commons';

// Prefixes
const API_EXTERNAL_REGISTRIES_PREFIX = 'ext-registry';

// Segments
const PA_SEGMENT = 'pa';
const API_VERSION_SEGMENT = 'v1';
const API_ACTIVATED_PARTIES_SEGMENT = 'activated-on-pn';

// Paths
const API_EXTERNAL_REGISTRIES_BASE_PATH = `${PA_SEGMENT}/${API_VERSION_SEGMENT}`;
const API_GET_ALL_ACTIVATED_PARTIES = `${API_EXTERNAL_REGISTRIES_BASE_PATH}/${API_ACTIVATED_PARTIES_SEGMENT}`;

// APIs
export function GET_ALL_ACTIVATED_PARTIES(payload?: { paNameFilter: string }) {
  return compileRoute({
    prefix: API_EXTERNAL_REGISTRIES_PREFIX,
    path: API_GET_ALL_ACTIVATED_PARTIES,
    query: payload,
  });
}
