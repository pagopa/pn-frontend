import { createSlice } from "@reduxjs/toolkit";
import { login } from "./actions";
import { UserSession } from "./types";

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        token: ''
    } as UserSession,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.token = action.payload.token;
        });
    }
});

export default userSlice;