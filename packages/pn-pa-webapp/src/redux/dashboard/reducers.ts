import { createSlice } from "@reduxjs/toolkit";
import { getSentNotifications } from "./actions";
import { Notification } from "./types";

/* eslint-disable functional/immutable-data */
const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState: {
        loading: false,
        notifications: [] as Array<Notification>
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSentNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload;
            // TODO: implementare salvataggio pagine
        });
        builder.addCase(getSentNotifications.pending, (state) => {
            state.loading = true;
        });
    }
});

export default dashboardSlice;