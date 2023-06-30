import MockAdapter from 'axios-mock-adapter'; 

import { AuthApi } from '../Auth.api';
import { userResponse } from '../../../redux/auth/__test__/test-users';
import { authClient } from '../../apiClients';

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
  it('exchangeToken', async() => {
    const res = await mockedExchangeToken();
    expect(res).toStrictEqual(userResponse);
  });
});