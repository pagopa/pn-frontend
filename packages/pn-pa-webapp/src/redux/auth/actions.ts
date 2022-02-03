import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserSession } from "./types";

export const login = createAsyncThunk<
    UserSession,
    string
// {
// 	rejectValue: ErrorDetails;
// }
>("auth/login", async (selfCareToken: string) => {

    // use selfcare token to get autenticated user
    console.log(selfCareToken);
    const token = '123';
    // const { user, token } = await AuthAPI.login(username, password);

    localStorage.setItem("token", token);
    // localStorage.setItem("userId", Number(user.id).toString());
    // localStorage.setItem("userProfiles", JSON.stringify(user.userProfiles));

    return { token };
});