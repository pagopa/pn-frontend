/* eslint-disable functional/immutable-data */
import {
  FimsTokenExchangeRequest,
  OneIdentityExchangeCodeBody,
  OneIdentityUser,
  TokenExchangeBody,
  TokenExchangeRequest,
  User,
  paramsToSourceType,
} from '../../models/User';
import { authClient } from '../apiClients';
import { AUTH_LOGOUT, AUTH_TOKEN_EXCHANGE, FIMS_TOKEN_EXCHANGE, ONE_IDENTITY_TOKEN_EXCHANGE } from './auth.routes';

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

    return response.data;
  },
  exchangeFimsToken: async ({ fimsToken }: FimsTokenExchangeRequest): Promise<User> => {
    const response = await authClient.post<User>(FIMS_TOKEN_EXCHANGE(), {
      authorizationToken: fimsToken,
    });

    return response.data;
  },
  exchangeOneIdentityCode: async ({
    code,
    state,
  }: OneIdentityExchangeCodeBody): Promise<OneIdentityUser> => {
    const response = await authClient.post<OneIdentityUser>(ONE_IDENTITY_TOKEN_EXCHANGE(), {
      code,
      state,
    });

    return response.data;
  },
  logout: (token: string): Promise<void> =>
    authClient.post(AUTH_LOGOUT(), null, { headers: { Authorization: `Bearer ${token}` } }),
};
