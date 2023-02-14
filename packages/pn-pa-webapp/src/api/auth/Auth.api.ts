import { User } from "../../redux/auth/types";
import { authClient } from "../apiClients";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

export const AuthApi = {
    exchangeToken: (selfCareToken: string): Promise<User> =>
      authClient.post<User>(AUTH_TOKEN_EXCHANGE(), {authorizationToken: selfCareToken})
        .then((response) => ({
            desired_exp: response.data.desired_exp,
            email: response.data.email,
            name: response.data.name,
            family_name: response.data.family_name,
            fiscal_number: response.data.fiscal_number,
            organization: response.data.organization,
            sessionToken: response.data.sessionToken,
            uid: response.data.uid,
        }))
};
