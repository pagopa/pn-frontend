import { compileRoute } from '@pagopa-pn/pn-commons';

// Prefixes
const API_EXTERNAL_REGISTRIES_PREFIX = 'ext-registry';

// Segments
const PA_SEGMENT = 'pa';
const API_VERSION_SEGMENT = 'v1';
const API_ACTIVATED_PARTIES_SEGMENT = 'activated-on-pn';

// Parameters
const API_INSTITUTION_ID_PARAMETER = 'id';

// Paths
const API_GET_ALL_ACTIVATED_PARTIES = `${API_ACTIVATED_PARTIES_SEGMENT}`;

// APIs
export function GET_PARTY_FOR_ORGANIZATION(organizationId: string) {
  return compileRoute({
    prefix: `${API_EXTERNAL_REGISTRIES_PREFIX}/${PA_SEGMENT}`,
    version: API_VERSION_SEGMENT,
    path: API_GET_ALL_ACTIVATED_PARTIES,
    query: {
      [API_INSTITUTION_ID_PARAMETER]: [organizationId],
    },
  });
}
