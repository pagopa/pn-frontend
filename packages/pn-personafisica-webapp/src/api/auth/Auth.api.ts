import { User } from "../../redux/auth/types";
import { authClient } from "../axios";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

export const AuthApi = {
    exchangeToken: (spidToken: string): Promise<User> => {
        const params = new URLSearchParams([['authorizationToken', spidToken]]);
        return authClient.get<User>(AUTH_TOKEN_EXCHANGE(), { params })
            .then((response) => response.data);
    }
};
