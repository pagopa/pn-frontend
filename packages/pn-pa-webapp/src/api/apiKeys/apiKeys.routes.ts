import { compileRoute } from '@pagopa-pn/pn-commons';

// Prefixes
const API_MANAGER_PREFIX = 'api-key-self';

// Parameters
const API_APIKEY_ID_PARAMETER = 'apiKeyId';

// Paths
const API_APIKEYS_PATH = 'api-keys';
const API_APIKEY_DELETE_PATH = `${API_APIKEYS_PATH}/:${API_APIKEY_ID_PARAMETER}`;

export function DELETE_APIKEY(apiKeyId: string) {
  return compileRoute({
    prefix: API_MANAGER_PREFIX,
    path: API_APIKEY_DELETE_PATH,
    params: {
      [API_APIKEY_ID_PARAMETER]: apiKeyId,
    },
  });
}
