import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationsApi } from "../../api/notifications/Notifications.api";
import { Notification } from "./types";

type Param = {
    startDate: string;
    endDate: string;
};

export const getSentNotifications = createAsyncThunk<Array<Notification>, Param>
    ("getSentNotifications", async (params: Param) => NotificationsApi.getSentNotifications(params.startDate, params.endDate));
