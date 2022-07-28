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

// Parameters
const API_EXTERNAL_REGISTRIES_ID_PARAMETER = 'id';

// APIs
export function GET_PARTY_FOR_ORGANIZATION(organizationId: string) {
  return compileRoute({
    prefix: API_EXTERNAL_REGISTRIES_PREFIX,
    path: API_GET_ALL_ACTIVATED_PARTIES,
    query: {
      [API_EXTERNAL_REGISTRIES_ID_PARAMETER]: [organizationId],
    }
  });
}
