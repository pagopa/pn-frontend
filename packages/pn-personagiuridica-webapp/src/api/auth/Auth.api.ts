import { User } from '../../redux/auth/types';
import { authClient } from '../apiClients';
import { AUTH_TOKEN_EXCHANGE } from './auth.routes';

interface TokenExchangeBody {
  authorizationToken: string;
  source?: {
    type: 'QR';
    id: string;
  };
}

export const AuthApi = {
  exchangeToken: async (spidToken: string, aar?: string): Promise<User> => {
    const body: TokenExchangeBody = { authorizationToken: spidToken };
    if (aar) {
      // eslint-disable-next-line functional/immutable-data
      body.source = {
        type: 'QR',
        id: aar,
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
      organization: response.data.organization,
      desired_exp: response.data.desired_exp,
      hasGroup: Boolean(
        response.data.organization &&
          response.data.organization.groups &&
          response.data.organization.groups.length > 0
      ),
    };
    if (aar && response.data.source) {
      /* eslint-disable-next-line functional/immutable-data */
      user.source = response.data.source;
    }
    return user;
  },
};
