import { ApiKeyStatusBE } from '../../models/ApiKeys';
import { apiClient } from '../apiClients';
import { DELETE_APIKEY, STATUS_APIKEY } from './apiKeys.routes';

const setResponseError = (response: number) => (response === 200 ? 'success' : 'error');

export const ApiKeysApi = {
  deleteApiKey: (apiKeyId: string): Promise<string> =>
    apiClient
      .delete<string>(DELETE_APIKEY(apiKeyId))
      .then((response) => setResponseError(response.status)),

  setApiKeyStatus: (apiKeyStatus: ApiKeyStatusBE): Promise<string> =>
    apiClient
      .put<string>(STATUS_APIKEY(apiKeyStatus.apiKey), { status: apiKeyStatus.status })
      .then((response) => setResponseError(response.status)),
};
