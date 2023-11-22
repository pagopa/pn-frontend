import MockAdapter from 'axios-mock-adapter';

import { userResponse } from '../../../__mocks__/Auth.mock';
import { getAuthClient } from '../../apiClients';
import { AuthApi } from '../Auth.api';
import { AUTH_TOKEN_EXCHANGE } from '../auth.routes';

describe('Auth api tests', () => {
  it('exchangeToken', async () => {
    const token = 'mocked-token';
    const mock = new MockAdapter(getAuthClient());
    mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: token }).reply(200, userResponse);
    const res = await AuthApi.exchangeToken(token);
    expect(res).toStrictEqual(userResponse);
    mock.reset();
    mock.restore();
  });
});
