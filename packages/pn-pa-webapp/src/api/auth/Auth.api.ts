import { authClient } from "../axios";

export type SessionToken = {
    sessionToken: string;
};

export const AuthApi = {
    exchangeToken: (selfCareToken: string): Promise<SessionToken> => {
        const params = new URLSearchParams([['authorizationToken', selfCareToken]]);
        return authClient.get<SessionToken>("/beta/session-token", { params })
            .then((response) => response.data);
    }
};
