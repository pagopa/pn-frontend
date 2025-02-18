import MockAdapter from 'axios-mock-adapter';

import { userResponse, userResponseWithSource } from '../../../__mocks__/Auth.mock';
import { authClient } from '../../apiClients';
import { AuthApi } from '../Auth.api';
import { AUTH_TOKEN_EXCHANGE } from '../auth.routes';

describe('Auth api tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(authClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('exchangeToken', async () => {
    const token = 'mocked-token';
    const mock = new MockAdapter(authClient);
    mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: token }).reply(200, userResponse);
    const res = await AuthApi.exchangeToken(token);
    expect(res).toStrictEqual(userResponse);
  });

  it('exchangeToken with aar', async () => {
    const token = 'mocked-token';
    const aar = 'mock-aar';
    const mock = new MockAdapter(authClient);
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: token, source: { type: 'QR', id: aar } })
      .reply(200, userResponseWithSource);
    const res = await AuthApi.exchangeToken(token, aar);
    expect(res).toStrictEqual(userResponseWithSource);
  });
});
