import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationsApi } from "../../api/notifications/Notifications.api";
import { GetNotificationsParams, GetNotificationsResponse } from "./types";

export const getSentNotifications = createAsyncThunk<GetNotificationsResponse, GetNotificationsParams>
    ("getSentNotifications", async (params: GetNotificationsParams) => NotificationsApi.getSentNotifications(params));