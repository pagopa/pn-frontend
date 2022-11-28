import MockAdapter from 'axios-mock-adapter'; 

import { AuthApi } from '../Auth.api';
import { userResponse } from '../../../redux/auth/__test__/test-utils';
import { authClient } from '../../apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../auth.routes';

export async function mockedExchangeToken() {
  const token = 'mocked-token';
  const axiosMock = new MockAdapter(authClient);
  axiosMock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, userResponse);
  const res = await AuthApi.exchangeToken(token);
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

describe('Auth api tests', () => {
  it('exchangeToken', async() => {
    const res = await mockedExchangeToken();
    expect(res).toStrictEqual(userResponse);
  });
});