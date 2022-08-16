import { User } from "../../redux/auth/types";
import { authClient } from "../axios";
import { AUTH_TOKEN_EXCHANGE } from "./auth.routes";

export const AuthApi = {
    exchangeToken: (spidToken: string): Promise<User> => {
        const params = new URLSearchParams([['authorizationToken', spidToken]]);
        return authClient.get<User>(AUTH_TOKEN_EXCHANGE(), { params })
            // .then((response) => response.data);
            .then((response) => {
                if (response.data.fiscal_number === "FRMTTR76M06B715E") {
                    return Promise.reject({ response: { 
                        status: 403, 
                    }});
                } else {
                    return response.data;
                }
            })
            // .catch(() => Promise.reject({ response: { 
            //     status: 400,
            //     data: { error: 'Token is not valid' } 
            // }}))
            ;
            // .then(() => Promise.reject({ response: { 
            //     status: 403, 
            // }}));
            // .then(() => Promise.reject({ error:'bad token' }));
    }
};
