import { User } from "../../redux/auth/types";
import { authClient } from "../axios";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

export const AuthApi = {
    exchangeToken: (selfCareToken: string): Promise<User> =>
        authClient.post<User>(AUTH_TOKEN_EXCHANGE(), {authorizationToken: selfCareToken})
          .then((response) => response.data)
};
