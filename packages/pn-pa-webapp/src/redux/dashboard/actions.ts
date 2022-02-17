import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationsApi } from "../../api/notifications/Notifications.api";
import { GetNotificationsParams, GetNotificationsResponse } from "./types";

export const getSentNotifications = createAsyncThunk<GetNotificationsResponse, GetNotificationsParams>
    ("getSentNotifications", async (params: GetNotificationsParams, { rejectWithValue }) => {
        try {
            return await NotificationsApi.getSentNotifications(params);
        } catch(e) {
            return rejectWithValue(e);
        }
    });

export const setPagination = createAction<{totalElements: number; page: number; size: number}>('setPagination');

export const setSorting = createAction<{orderBy: string; order: 'asc' | 'desc'}>('setSorting');

export const setNotificationFilters = createAction<GetNotificationsParams>('setNotificationFilters');
