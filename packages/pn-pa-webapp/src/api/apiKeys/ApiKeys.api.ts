import { ApiKey, ApiKeyStatusBE, GetApiKeysResponse, GetNewApiKeyResponse, NewApiKeyBE } from '../../models/ApiKeys';
import { apiClient } from '../axios';
import { APIKEY_LIST, CREATE_APIKEY, DELETE_APIKEY, STATUS_APIKEY } from './apiKeys.routes';

const setResponseError = (response: number) => (response === 200 ? 'success' : 'error');

export const ApiKeysApi = {
  getApiKeys: (): Promise<Array<ApiKey>> =>
    apiClient.get<GetApiKeysResponse>(APIKEY_LIST()).then((response) => {
      if (response.data && response.data.items) {
        const data = response.data;
        return data.items.map((item) => ({ ...item, apiKey: item.id }));
      }
      return [];
    }),
  createNewApiKey: (newApiKey: NewApiKeyBE): Promise<string> =>
    apiClient.post<GetNewApiKeyResponse>(CREATE_APIKEY(), newApiKey).then((response) => {
      const data = response.data;
      return data.apiKey;
    }),
  deleteApiKey: (apiKeyId: string): Promise<string> =>
    apiClient
      .delete<string>(DELETE_APIKEY(apiKeyId))
      .then((response) => setResponseError(response.status)),
  setApiKeyStatus: (apiKeyStatus: ApiKeyStatusBE): Promise<string> =>
    apiClient
      .put<string>(STATUS_APIKEY(apiKeyStatus.apiKey), { status: apiKeyStatus.status })
      .then((response) => setResponseError(response.status)),
};
