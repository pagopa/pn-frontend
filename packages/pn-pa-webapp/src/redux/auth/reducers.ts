import { createSlice } from "@reduxjs/toolkit";
import { exchangeToken } from "./actions";
import { User } from "./types";

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        loading: false,
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : {
            sessionToken: '',
            family_name: '',
            fiscal_number: '',
            organization: {
                id: '',
                role: ''
            }
        } as User
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(exchangeToken.fulfilled, (state, action) => {
            state.user = action.payload;
        });
        builder.addCase(exchangeToken.pending, (state) => {
            state.loading = true;
        });
    }
});

export default userSlice;