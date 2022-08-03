import { GetNotificationsParams, GetNotificationsResponse } from "@pagopa-pn/pn-commons";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationsApi } from "../../api/notifications/Notifications.api";

export const getReceivedNotifications = createAsyncThunk<GetNotificationsResponse, GetNotificationsParams>
    ("getReceivedNotifications", async (params: GetNotificationsParams, { rejectWithValue }) => {
        try {
            return await NotificationsApi.getReceivedNotifications(params);
        } catch(e) {
            return rejectWithValue(e);
        }
    });
