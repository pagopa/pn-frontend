import MockAdapter from 'axios-mock-adapter';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { userResponse, userResponseWithRetrievalId } from '../../../__mocks__/Auth.mock';
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
    const spidToken = 'mocked-token';
    mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: spidToken }).reply(200, userResponse);
    const res = await AuthApi.exchangeToken({ spidToken });
    expect(res).toStrictEqual(userResponse);
  });

  it.only('exchangeToken with rapidAccess', async () => {
    const spidToken = 'mocked-token';
    const rapidAccess: [AppRouteParams, string] = [AppRouteParams.AAR, 'mocked-qr-code'];
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), {
        authorizationToken: spidToken,
        source: {
          type: 'QR',
          id: 'mocked-qr-code',
        },
      })
      .reply(200, userResponseWithRetrievalId);
    const res = await AuthApi.exchangeToken({ spidToken, rapidAccess });
    expect(res).toStrictEqual(userResponseWithRetrievalId);
  });
});
