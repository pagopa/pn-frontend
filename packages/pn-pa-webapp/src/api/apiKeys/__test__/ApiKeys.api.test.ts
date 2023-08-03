import MockAdapter from 'axios-mock-adapter';

import { mockApi } from '../../../__test__/test-utils';
import { ApiKeySetStatus } from '../../../models/ApiKeys';
import { mockApiKeysFromBE } from '../../../redux/apiKeys/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { newApiKeyForBE } from '../../../redux/NewApiKey/__test__/test-utils';
import { apiClient } from '../../apiClients';
import { ApiKeysApi } from '../ApiKeys.api';
import { APIKEY_LIST, CREATE_APIKEY, DELETE_APIKEY, STATUS_APIKEY } from '../apiKeys.routes';

describe('Api keys api tests', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  afterEach(() => {
    mock.reset();
    mock.restore();
  });

  mockAuthentication();

  it('getApiKeys', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      APIKEY_LIST(),
      200,
      undefined,
      mockApiKeysFromBE
    );
    const res = await ApiKeysApi.getApiKeys();
    expect(res).toStrictEqual(mockApiKeysFromBE);
  });

  it('createNewApiKey', async () => {
    const mockRequest = {
      id: 'mocked-id',
      apiKey: 'mocked-apikey',
    };

    mock = mockApi(apiClient, 'POST', CREATE_APIKEY(), 200, newApiKeyForBE, mockRequest);
    const res = await ApiKeysApi.createNewApiKey(newApiKeyForBE);
    expect(res).toStrictEqual('mocked-apikey');
  });

  it('deleteApiKey', async () => {
    mock = mockApi(apiClient, 'DELETE', DELETE_APIKEY('mocked-apikey'), 200, undefined, 'success');
    const res = await ApiKeysApi.deleteApiKey('mocked-apikey');
    expect(res).toStrictEqual('success');
  });

  it('setApiKeyStatus', async () => {
    const mockRequest = {
      apiKey: 'mocked-apikey',
      status: ApiKeySetStatus.BLOCK,
    };

    mock = mockApi(apiClient, 'PUT', STATUS_APIKEY('mocked-apikey'), 200, undefined, 'success');
    const res = await ApiKeysApi.setApiKeyStatus(mockRequest);
    expect(res).toStrictEqual('success');
  });
});
