import { createSlice } from "@reduxjs/toolkit";

import { getSentNotifications, setPagination } from "./actions";
import { Notification } from "./types";

/* eslint-disable functional/immutable-data */
const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState: {
        loading: false,
        notifications: [] as Array<Notification>,
        filters: {
            startDate: '2022-01-01T00:00:00.000Z',
            endDate: '2022-12-31T00:00:00.000Z'
        },
        pagination: {
            totalElements: 0,
            size: 0,
            page: 0
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSentNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload.notifications;
            state.pagination.totalElements = action.payload.totalElements;
        });
        builder.addCase(getSentNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(setPagination, (state, action) => {
            state.pagination = action.payload;
        });
    }
}); 

export default dashboardSlice;