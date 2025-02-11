/* eslint-disable functional/immutable-data */
import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { User } from '../../redux/auth/types';
import { authClient } from '../apiClients';
import { AUTH_TOKEN_EXCHANGE } from './auth.routes';

interface TokenExchangeBody {
  authorizationToken: string;
  source?: {
    type: 'TPP' | 'QR';
    id: string;
  };
}

const paramsToSourceType: Record<AppRouteParams, 'TPP' | 'QR'> = {
  [AppRouteParams.AAR]: 'QR',
  [AppRouteParams.RETRIEVAL_ID]: 'TPP',
};

export interface TokenExchangeRequest {
  spidToken: string;
  rapidAccess?: [AppRouteParams, string];
}

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
};
