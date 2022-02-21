import { User } from "../../redux/auth/types";
import { authClient } from "../axios";

export const AuthApi = {
    exchangeToken: (spidToken: string): Promise<User> => {
        const params = new URLSearchParams([['authorizationToken', spidToken]]);
        return authClient.get<User>("token-exchange", { params })
            .then((response) => response.data);
    }
};
