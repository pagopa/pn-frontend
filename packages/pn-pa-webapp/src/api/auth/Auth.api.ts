import { User, SelfCareUser } from "../../redux/auth/types";
import { authClient } from "../axios";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

export const AuthApi = {
    exchangeToken: (selfCareToken: string): Promise<User> => {
        const params = new URLSearchParams([['authorizationToken', selfCareToken]]);
        return authClient.get<SelfCareUser>(AUTH_TOKEN_EXCHANGE(), { params })
            // .then((response) => ({...response.data, groups: response.data.groups?.split(',')}));
            .then((response) => {
                if (response.data.fiscal_number === "BRNBCH91L49H822E") {
                    return Promise.reject({ response: { 
                        status: 403, 
                    }});
                } else {
                    return {...response.data, groups: response.data.groups?.split(',')};
                }
            });
    }
};
