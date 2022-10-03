import { responseMap } from '@pagopa-pn/pn-commons';

import { User } from "../../redux/auth/types";
import { authClient } from "../axios";
import { PartyRole, PNRole } from "../../models/user";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

const emptyUser = {
  sessionToken: '',
  name: '',
  family_name:  '',
  fiscal_number:  '',
  email: '',
  uid: '',
  organization: {
    id: '',
    roles: [{
      role: PNRole.OPERATOR,
      partyRole: PartyRole.OPERATOR,
    }],
    fiscal_code: '',
  },
  desired_exp: 0
};

export const AuthApi = {
    exchangeToken: (selfCareToken: string): Promise<User> =>
      authClient.post<User>(AUTH_TOKEN_EXCHANGE(), {authorizationToken: selfCareToken})
        .then((response) => responseMap(response.data, emptyUser))
};
