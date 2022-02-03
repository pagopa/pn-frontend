import { createSlice } from "@reduxjs/toolkit";
import { login } from "./actions";
import { UserSession } from "./types";

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        loading: false,
        token: ''
    } as UserSession & { loading: boolean },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.token = action.payload.token;
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });
    }
});

export default userSlice;