import { createSlice } from "@reduxjs/toolkit";
import { today, tenYearsAgo } from "../../utils/date.utility";

import { getSentNotifications, setPagination, setSorting, setNotificationFilters } from "./actions";
import { GetNotificationsParams, Notification } from "./types";

/* eslint-disable functional/immutable-data */
const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState: {
        loading: false,
        notifications: [] as Array<Notification>,
        filters: {
            startDate: tenYearsAgo.toISOString(),
            endDate: today.toISOString(),
            recipientId: '',
            status: '',
            subjectRegExp: '',
        } as GetNotificationsParams,
        pagination: {
            totalElements: 0,
            size: 0,
            page: 0
        },
        sort: {
           orderBy: '',
           order: 'asc' as ('asc' | 'desc')
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
        builder.addCase(setSorting, (state, action) => {
            state.sort = action.payload;
        });
        builder.addCase(setNotificationFilters, (state, action) => {
            state.filters = action.payload;
            
        });
    }
}); 

export default dashboardSlice;