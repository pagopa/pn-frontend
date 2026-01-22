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

  it('exchangeToken with rapidAccess', async () => {
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

  // describe('exchangeOneIdentityCode', () => {
  //   const code = 'mock-code';
  //   const state = 'mock-state';
  //   const nonce = 'mock-nonce';
  //   const redirectUri = 'mock-redirect-uri';

  //   it('exchange one identity code successfully', async () => {
  //     mock
  //       .onPost(ONE_IDENTITY_TOKEN_EXCHANGE(), { code, state, nonce, redirectUri })
  //       .reply(200, userResponse);
  //     const res = await AuthApi.exchangeOneIdentityCode({ code, state, nonce, redirectUri });
  //     expect(res).toStrictEqual(userResponse);
  //   });

  //   it('exchange one identity code with rapidAccess successfully', async () => {
  //     const rapidAccess: [AppRouteParams, string] = [AppRouteParams.AAR, 'mocked-qr-code'];
  //     mock
  //       .onPost(ONE_IDENTITY_TOKEN_EXCHANGE(), {
  //         code,
  //         state,
  //         nonce,
  //         redirectUri,
  //         source: {
  //           type: 'QR',
  //           id: 'mocked-qr-code',
  //         },
  //       })
  //       .reply(200, userResponseWithRetrievalId);
  //     const res = await AuthApi.exchangeOneIdentityCode({
  //       code,
  //       state,
  //       nonce,
  //       redirectUri,
  //       rapidAccess,
  //     });
  //     expect(res).toStrictEqual(userResponseWithRetrievalId);
  //   });
  // });
});
