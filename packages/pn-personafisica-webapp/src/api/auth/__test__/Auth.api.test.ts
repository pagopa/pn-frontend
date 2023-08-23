import MockAdapter from 'axios-mock-adapter';
import { userResponse } from '../../../__mocks__/Auth.mock';
import { authClient } from '../../apiClients';
import { AuthApi } from '../Auth.api';
import { AUTH_TOKEN_EXCHANGE } from '../auth.routes';

export async function mockedExchangeToken() {
  const token = 'mocked-token';
  const axiosMock = new MockAdapter(authClient);
  axiosMock.onPost(`/token-exchange`).reply(200, userResponse);
  const res = await AuthApi.exchangeToken(token);
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

describe('Auth api tests', () => {
  it('exchangeToken', async () => {
    const token = 'mocked-token';
    const mock = new MockAdapter(authClient);
    mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: token }).reply(200, userResponse);
    const res = await AuthApi.exchangeToken(token);
    expect(res).toStrictEqual(userResponse);
    mock.reset();
    mock.restore();
  });
});
