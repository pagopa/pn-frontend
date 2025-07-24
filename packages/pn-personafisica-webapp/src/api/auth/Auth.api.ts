/* eslint-disable functional/immutable-data */
import {
  TokenExchangeBody,
  TokenExchangeRequest,
  User,
  paramsToSourceType,
} from '../../models/User';
import { authClient } from '../apiClients';
import { AUTH_LOGOUT, AUTH_TOKEN_EXCHANGE } from './auth.routes';

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
    const user: User = {
      sessionToken: response.data.sessionToken,
      email: response.data.email,
      name: response.data.name,
      family_name: response.data.family_name,
      uid: response.data.uid,
      fiscal_number: response.data.fiscal_number,
      from_aa: response.data.from_aa,
      aud: response.data.aud,
      level: response.data.level,
      iat: response.data.iat,
      exp: response.data.exp,
      iss: response.data.iss,
      jti: response.data.jti,
    };
    if (response.data.source) {
      user.source = response.data.source;
    }
    return user;
  },
  logout: (token: string): Promise<void> =>
    authClient.post(AUTH_LOGOUT(), null, { headers: { Authorization: `Bearer ${token}` } }),
};
