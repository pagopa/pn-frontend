import { ApiKeyDTO, ApiKeyStatusBE, GetApiKeysResponse, GetNewApiKeyResponse, NewApiKeyBE } from '../../models/ApiKeys';
import { apiClient } from '../apiClients';
import { APIKEY_LIST, CREATE_APIKEY, DELETE_APIKEY, STATUS_APIKEY } from './apiKeys.routes';

const setResponseError = (response: number) => (response === 200 ? 'success' : 'error');

export const ApiKeysApi = {
  getApiKeys: (): Promise<Array<ApiKeyDTO>> =>
    apiClient.get<GetApiKeysResponse>(APIKEY_LIST(), {params: {showVirtualKey: true}}).then((response) => {
      if (response.data && response.data.items) {
        return response.data.items;
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
