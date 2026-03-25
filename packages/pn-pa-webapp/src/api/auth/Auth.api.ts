import { removeNullProperties } from '@pagopa-pn/pn-commons';

import { PNRole, PartyRole, User } from '../../models/user';
import { authClient } from '../apiClients';
import { AUTH_LOGOUT, AUTH_TOKEN_EXCHANGE } from './auth.routes';

const supportOrganization = {
  id: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
  name: 'Comune di Palermo',
  roles: [
    {
      partyRole: PartyRole.SUPPORT,
      role: PNRole.SUPPORT,
    },
  ],
  fiscal_code: '80016350821',
  ipaCode: 'c_g273',
};

export const AuthApi = {
  exchangeToken: (selfCareToken: string): Promise<User> =>
    authClient
      .post<User>(AUTH_TOKEN_EXCHANGE(), { authorizationToken: selfCareToken })
      .then((response): User => {
        // eslint-disable-next-line functional/immutable-data
        // response.data = {
        //   uid: '4253a451-4b19-476f-8f8f-baa10f9934de',
        //   email: 'f.bianchi@codermine.com',
        //   organization: supportOrganization,
        //   desired_exp: response.data.desired_exp,
        //   sessionToken: response.data.sessionToken,
        // };
        console.log(response, supportOrganization);

        return removeNullProperties<User>({
          desired_exp: response.data.desired_exp,
          email: response.data.email,
          name: response.data.name,
          family_name: response.data.family_name,
          fiscal_number: response.data.fiscal_number,
          organization: response.data.organization,
          sessionToken: response.data.sessionToken,
          uid: response.data.uid,
        });
      }),
  logout: (token: string): Promise<void> =>
    authClient.post(AUTH_LOGOUT(), null, { headers: { Authorization: `Bearer ${token}` } }),
};
