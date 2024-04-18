import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../apiClients';
import { ApiKeysApi } from '../ApiKeys.api';
import { DELETE_APIKEY } from '../apiKeys.routes';

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
});
