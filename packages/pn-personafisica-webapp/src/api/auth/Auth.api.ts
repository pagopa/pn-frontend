import { responseMap } from '@pagopa-pn/pn-commons';

import { User } from "../../redux/auth/types";
import { authClient } from "../axios";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

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
        .then((response) => responseMap(response.data, emptyUser))
};
