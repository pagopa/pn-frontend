import { compileRoute } from '@pagopa-pn/pn-commons';

import { ApiKeyParam } from '../../models/ApiKeys';

// Prefixes
const API_MANAGER_PREFIX = 'api-key-self';

// Parameters
const API_APIKEY_ID_PARAMETER = 'apiKeyId';
const API_APIKEY_LIMIT_PARAMETER = 'limit';
const API_APIKEY_LAST_KEY_PARAMETER = 'lastKey';
const API_APIKEY_LAST_UPDATE_PARAMETER = 'lastUpdate';
const API_APIKEY_SHOW_VIRTUAL_KEY_PARAMETER = 'showVirtualKey';

// Paths
const API_APIKEYS_PATH = 'api-keys';
const API_APIKEY_DELETE_PATH = `${API_APIKEYS_PATH}/:${API_APIKEY_ID_PARAMETER}`;
const API_APIKEY_STATUS_PATH = `${API_APIKEYS_PATH}/:${API_APIKEY_ID_PARAMETER}/status`;

export function APIKEY_LIST(params?: ApiKeyParam) {
  return compileRoute({
    prefix: API_MANAGER_PREFIX,
    path: API_APIKEYS_PATH,
    query: {
      [API_APIKEY_LIMIT_PARAMETER]: params?.limit ?? '',
      [API_APIKEY_LAST_KEY_PARAMETER]: params?.lastKey ?? '',
      [API_APIKEY_LAST_UPDATE_PARAMETER]: params?.lastUpdate ?? '',
      [API_APIKEY_SHOW_VIRTUAL_KEY_PARAMETER]: 'true',
    },
  });
}

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
