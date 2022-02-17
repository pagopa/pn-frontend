import { createSlice } from "@reduxjs/toolkit";

import { getSentNotifications, setPagination, setSorting, setNotificationFilters } from "./actions";
import { GetNotificationsParams, Notification } from "./types";

/* eslint-disable functional/immutable-data */
const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState: {
        loading: false,
        notifications: [] as Array<Notification>,
        filters: {
            startDate: '2022-01-01T00:00:00.000Z',
            endDate: '2022-12-31T00:00:00.000Z',
            recipientId: '',
            status: '',
            subjectRegExp: '',
        } as GetNotificationsParams,
        pagination: {
            nextPagesKey: [] as Array<string>,
            size: 0,
            page: 0,
            moreResult: false
        },
        sort: {
           orderBy: '',
           order: 'asc' as ('asc' | 'desc')
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSentNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload.results;
            state.pagination.moreResult = action.payload.moreResult;
            // because we can jump from a page to another and nextPagesKey returns only the next three pages, we have to check if that pages already exists
            for (const pageKey of action.payload.nextPagesKey) {
                if (state.pagination.nextPagesKey.indexOf(pageKey) === -1) {
                    state.pagination.nextPagesKey.push(pageKey);
                }
            }
        });
        builder.addCase(getSentNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(setPagination, (state, action) => {
            state.pagination.size = action.payload.size;
            state.pagination.page = action.payload.page;
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