import { User } from '../../redux/auth/types';
import { authClient } from '../apiClients';
import { AUTH_TOKEN_EXCHANGE } from './auth.routes';

export const AuthApi = {
  exchangeToken: (spidToken: string): Promise<User> =>
    authClient
      .post<User>(AUTH_TOKEN_EXCHANGE(), { authorizationToken: spidToken })
      .then((response) => ({
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
        organization: response.data.organization,
        desired_exp: response.data.desired_exp,
        hasGroup: Boolean(
          response.data.organization &&
            response.data.organization.groups &&
            response.data.organization.groups.length > 0
        ),
      })),
};
