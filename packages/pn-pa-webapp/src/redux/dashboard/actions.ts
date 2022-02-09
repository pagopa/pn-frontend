import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationsApi } from "../../api/notifications/Notifications.api";
import { GetNotificationsParams, Notification } from "./types";

export const getSentNotifications = createAsyncThunk<Array<Notification>, GetNotificationsParams>
    ("getSentNotifications", async (params: GetNotificationsParams) => NotificationsApi.getSentNotifications(params));
