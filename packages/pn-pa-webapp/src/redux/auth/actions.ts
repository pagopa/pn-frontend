import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthApi } from "../../api/auth/Auth.api";
import { UserSession } from "./types";

export const login = createAsyncThunk<
    UserSession,
    string
// {
// 	rejectValue: ErrorDetails;
// }
>("exchangeToken", async (selfCareToken: string) => {

    // use selfcare token to get autenticated user
    const token = await AuthApi.exchangeToken(selfCareToken);
    localStorage.setItem("sessionToken", token.sessionToken);
    localStorage.setItem("selfCareToken", selfCareToken);

    return { token: token.sessionToken };
});