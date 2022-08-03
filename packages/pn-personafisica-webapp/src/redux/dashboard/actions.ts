import { GetNotificationsParams, GetNotificationsResponse } from "@pagopa-pn/pn-commons";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationsApi } from "../../api/notifications/Notifications.api";

export const getReceivedNotifications = createAsyncThunk<GetNotificationsResponse, GetNotificationsParams>
    ("getReceivedNotifications", async (params: GetNotificationsParams, { rejectWithValue }) => {
        try {
            return await NotificationsApi.getReceivedNotifications(params);
        } catch(e) {
            return rejectWithValue(e);
        }
    });

export const setPagination = createAction<{page: number; size: number}>('setPagination');

export const setSorting = createAction<{orderBy: string; order: 'asc' | 'desc'}>('setSorting');

export const setNotificationFilters = createAction<GetNotificationsParams>('setNotificationFilters');

export const setMandateId = createAction<string | undefined>('setMandateId');
