import { User } from "../../redux/auth/types";
import { authClient } from "../axios";
import { PartyRole, PNRole } from "../../models/user";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

function userMap<T>(values: Partial<T>, emptyObject: T): T {
  return Object.keys(emptyObject).reduce((acc: any, key: string) => {
    // eslint-disable-next-line functional/immutable-data
    acc[key] = values[key as keyof T];
    return acc;
  }, {}) as T;
}

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
        .then((response) => userMap(response.data, emptyUser))
};
