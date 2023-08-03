import { mockApi } from '../../../__test__/test-utils';
import { userResponse } from '../../../redux/auth/__test__/test-utils';
import { authClient } from '../../apiClients';
import { AuthApi } from '../Auth.api';
import { AUTH_TOKEN_EXCHANGE } from '../auth.routes';

export async function mockedExchangeToken() {
  const token = 'mocked-token';
  const axiosMock = mockApi(
    authClient,
    'POST',
    AUTH_TOKEN_EXCHANGE(),
    200,
    undefined,
    userResponse
  );
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