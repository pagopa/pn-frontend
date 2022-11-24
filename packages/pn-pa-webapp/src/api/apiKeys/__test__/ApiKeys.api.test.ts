import MockAdapter from 'axios-mock-adapter';
import { mockApiKeysForFE, mockApiKeysFromBE } from '../../../redux/apiKeys/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { apiClient } from '../../axios';
import { APIKEY_LIST, CREATE_APIKEY, DELETE_APIKEY, STATUS_APIKEY } from '../apiKeys.routes';
import { ApiKeysApi } from '../ApiKeys.api';
import { newApiKeyForBE } from '../../../redux/NewApiKey/__test__/test-utils';
import { ApiKeySetStatus } from '../../../models/ApiKeys';

describe('Api keys api tests', () => {
  mockAuthentication();

  it('getApiKeys', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(APIKEY_LIST()).reply(200, mockApiKeysFromBE);
    const res = await ApiKeysApi.getApiKeys();
    expect(res).toStrictEqual(mockApiKeysForFE);
    mock.reset();
    mock.restore();
  });

  it('createNewApiKey', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPost(CREATE_APIKEY()).reply(200, {
      id: 'mocked-id',
      'api-key': 'mocked-apikey',
    });
    const res = await ApiKeysApi.createNewApiKey(newApiKeyForBE);
    expect(res).toStrictEqual('mocked-apikey');
    mock.reset();
    mock.restore();
  });

  it('deleteApiKey', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onDelete(DELETE_APIKEY('mocked-apikey')).reply(200, 'success');
    const res = await ApiKeysApi.deleteApiKey('mocked-apikey');
    expect(res).toStrictEqual('success');
    mock.reset();
    mock.restore();
  });

  it('setApiKeyStatus', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPut(STATUS_APIKEY('mocked-apikey')).reply(200, 'success');
    const res = await ApiKeysApi.setApiKeyStatus({
      apiKey: 'mocked-apikey',
      status: ApiKeySetStatus.BLOCK,
    });
    expect(res).toStrictEqual('success');
    mock.reset();
    mock.restore();
  });
});
