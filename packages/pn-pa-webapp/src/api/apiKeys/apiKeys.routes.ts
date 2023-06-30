const API_MANAGER_PREFIX = '/api-key-self/';
const API_APIKEYS_PATH = 'api-keys/';

export function APIKEY_LIST() {
  return `${API_MANAGER_PREFIX}${API_APIKEYS_PATH}`;
}

export function CREATE_APIKEY() {
  return `${API_MANAGER_PREFIX}${API_APIKEYS_PATH}`;
}

export function DELETE_APIKEY(apiKeyId: string) {
  return `${API_MANAGER_PREFIX}${API_APIKEYS_PATH}${apiKeyId}`;
}

export function STATUS_APIKEY(apiKeyId: string) {
  return `${API_MANAGER_PREFIX}${API_APIKEYS_PATH}${apiKeyId}/status`;
}
