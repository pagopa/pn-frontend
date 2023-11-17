import MockAdapter from 'axios-mock-adapter';

import { mockApiKeysDTO } from '../../../__mocks__/ApiKeys.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { newApiKeyDTO, newApiKeyResponse } from '../../../__mocks__/NewApiKey.mock';
import { ApiKeySetStatus } from '../../../models/ApiKeys';
import { getApiClient } from '../../apiClients';
import { ApiKeysApi } from '../ApiKeys.api';
import { APIKEY_LIST, CREATE_APIKEY, DELETE_APIKEY, STATUS_APIKEY } from '../apiKeys.routes';

describe('Api keys api tests', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('getApiKeys', async () => {
    mock.onGet(APIKEY_LIST()).reply(200, mockApiKeysDTO);
    const res = await ApiKeysApi.getApiKeys();
    expect(res).toStrictEqual(mockApiKeysDTO);
  });

  it('createNewApiKey', async () => {
    mock.onPost(CREATE_APIKEY(), newApiKeyDTO).reply(200, newApiKeyResponse);
    const res = await ApiKeysApi.createNewApiKey(newApiKeyDTO);
    expect(res).toStrictEqual(newApiKeyResponse.apiKey);
  });

  it('deleteApiKey', async () => {
    mock.onDelete(DELETE_APIKEY('mocked-apikey')).reply(200);
    const res = await ApiKeysApi.deleteApiKey('mocked-apikey');
    expect(res).toStrictEqual('success');
  });

  it('setApiKeyStatus', async () => {
    const mockRequest = {
      apiKey: 'mocked-apikey',
      status: ApiKeySetStatus.BLOCK,
    };

    mock.onPut(STATUS_APIKEY(mockRequest.apiKey), { status: mockRequest.status }).reply(200);
    const res = await ApiKeysApi.setApiKeyStatus(mockRequest);
    expect(res).toStrictEqual('success');
  });
});
