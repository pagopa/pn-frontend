import { createSlice } from "@reduxjs/toolkit";

import { UserRole } from "../../models/user";
import { exchangeToken, logout } from "./actions";
import { User } from "./types";

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        loading: false,
        user: (sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') || '') : {
            sessionToken: '',
            family_name: '',
            fiscal_number: '',
            organization: {
                id: '',
                role: UserRole.REFERENTE_AMMINISTRATIVO
            }
        }) as User
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(exchangeToken.fulfilled, (state, action) => {
            state.user = action.payload;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    }
});

export default userSlice;