import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthApi } from "../../api/auth/Auth.api";
import { User } from "./types";

export const exchangeToken = createAsyncThunk<
    User,
    string
// {
// 	rejectValue: ErrorDetails;
// }
>("exchangeToken", async (selfCareToken: string) => {

    // use selfcare token to get autenticated user
    if (selfCareToken && selfCareToken !== '') {
        const user = await AuthApi.exchangeToken(selfCareToken);
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    } else {
        const user: User = JSON.parse(localStorage.getItem("user") || '');
        return user;
    }
});