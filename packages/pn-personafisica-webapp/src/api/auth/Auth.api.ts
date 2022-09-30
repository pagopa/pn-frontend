import { User } from "../../redux/auth/types";
import { authClient } from "../axios";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

function userMap<T>(values: Partial<T>, emptyObject: T): T {
    return Object.keys(emptyObject)
      .reduce((acc: any, key: string) => {
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
    mobile_phone: '',
    from_aa: false,
    aud: '',
    level: '',
    iat: 0,
    exp: 0,
    iss: '',
    jti: '',
};

export const AuthApi = {
    exchangeToken: (spidToken: string): Promise<User> =>
      authClient.post<User>(AUTH_TOKEN_EXCHANGE(), {authorizationToken: spidToken})
        .then((response) => userMap(response.data, emptyUser))
};
