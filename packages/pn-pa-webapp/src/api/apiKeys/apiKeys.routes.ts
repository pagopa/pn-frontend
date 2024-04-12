import { compileRoute } from '@pagopa-pn/pn-commons';

// Prefixes
const API_MANAGER_PREFIX = 'api-key-self';

// Parameters
const API_APIKEY_ID_PARAMETER = 'apiKeyId';

// Paths
const API_APIKEYS_PATH = 'api-keys';
const API_APIKEY_DELETE_PATH = `${API_APIKEYS_PATH}/:${API_APIKEY_ID_PARAMETER}`;
const API_APIKEY_STATUS_PATH = `${API_APIKEYS_PATH}/:${API_APIKEY_ID_PARAMETER}/status`;

export function CREATE_APIKEY() {
  return compileRoute({
    prefix: API_MANAGER_PREFIX,
    path: API_APIKEYS_PATH,
  });
}

export function DELETE_APIKEY(apiKeyId: string) {
  return compileRoute({
    prefix: API_MANAGER_PREFIX,
    path: API_APIKEY_DELETE_PATH,
    params: {
      [API_APIKEY_ID_PARAMETER]: apiKeyId,
    },
  });
}

export function STATUS_APIKEY(apiKeyId: string) {
  return compileRoute({
    prefix: API_MANAGER_PREFIX,
    path: API_APIKEY_STATUS_PATH,
    params: {
      [API_APIKEY_ID_PARAMETER]: apiKeyId,
    },
  });
}
