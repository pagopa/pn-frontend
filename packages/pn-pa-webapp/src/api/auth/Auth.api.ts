import { removeNullProperties } from '@pagopa-pn/pn-commons/src/utility/user.utility';

import { User } from '../../models/user';
import { authClient } from '../apiClients';
import { AUTH_LOGOUT, AUTH_TOKEN_EXCHANGE } from './auth.routes';

export const AuthApi = {
  exchangeToken: (selfCareToken: string): Promise<User> =>
    authClient
      .post<User>(AUTH_TOKEN_EXCHANGE(), { authorizationToken: selfCareToken })
      .then((response) =>
        removeNullProperties({
          desired_exp: response.data.desired_exp,
          email: response.data.email,
          name: response.data.name,
          family_name: response.data.family_name,
          fiscal_number: response.data.fiscal_number,
          organization: response.data.organization,
          sessionToken: response.data.sessionToken,
          uid: response.data.uid,
        })
      ),
  logout: (token: string): Promise<void> =>
    authClient.post(AUTH_LOGOUT(), null, { headers: { Authorization: `Bearer ${token}` } }),
};
