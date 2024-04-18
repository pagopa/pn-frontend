import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { ApiKeySetStatus } from '../../../models/ApiKeys';
import { apiClient } from '../../apiClients';
import { ApiKeysApi } from '../ApiKeys.api';
import { DELETE_APIKEY, STATUS_APIKEY } from '../apiKeys.routes';

describe('Api keys api tests', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
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
