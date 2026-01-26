/* eslint-disable functional/immutable-data */
import {
  OneIdentityCodeExchangeRequest,
  OneIdentityExchangeCodeBody,
  TokenExchangeBody,
  TokenExchangeRequest,
  User,
  paramsToSourceType,
} from '../../models/User';
import { parseTokenExchangeResponse } from '../../utility/user.utility';
import { authClient } from '../apiClients';
import { AUTH_LOGOUT, AUTH_TOKEN_EXCHANGE, ONE_IDENTITY_TOKEN_EXCHANGE } from './auth.routes';

export const AuthApi = {
  exchangeToken: async ({ spidToken, rapidAccess }: TokenExchangeRequest): Promise<User> => {
    const body: TokenExchangeBody = { authorizationToken: spidToken };
    if (rapidAccess) {
      const [param, value] = rapidAccess;
      body.source = {
        type: paramsToSourceType[param],
        id: value,
      };
    }
    const response = await authClient.post<User>(AUTH_TOKEN_EXCHANGE(), body);

    return parseTokenExchangeResponse(response.data);
  },
  exchangeOneIdentityCode: async ({
    code,
    state,
    nonce,
    redirectUri,
    rapidAccess,
  }: OneIdentityCodeExchangeRequest): Promise<User> => {
    const body: OneIdentityExchangeCodeBody = {
      code,
      state,
      nonce,
      redirect_uri: redirectUri,
    };
    if (rapidAccess) {
      const [param, value] = rapidAccess;
      body.source = {
        type: paramsToSourceType[param],
        id: value,
      };
    }
    const response = await authClient.post<User>(ONE_IDENTITY_TOKEN_EXCHANGE(), body);

    return parseTokenExchangeResponse(response.data);
  },
  logout: (token: string): Promise<void> =>
    authClient.post(AUTH_LOGOUT(), null, { headers: { Authorization: `Bearer ${token}` } }),
};
