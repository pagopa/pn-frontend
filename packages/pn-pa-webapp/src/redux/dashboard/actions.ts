import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationsApi } from "../../api/notifications/Notifications.api";
import { GetNotificationsParams, GetNotificationsResponse } from "./types";

export const getSentNotifications = createAsyncThunk<GetNotificationsResponse, GetNotificationsParams>
    ("getSentNotifications", async (params: GetNotificationsParams) => NotificationsApi.getSentNotifications(params));

export const setPagination = createAction<{totalElements: number; page: number; size: number}>('setPagination');