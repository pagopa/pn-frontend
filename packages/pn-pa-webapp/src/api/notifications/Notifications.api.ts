import { Notification } from "../../redux/dashboard/types";
import { apiClient } from "../axios";

export const NotificationsApi = {
    /**
     * Gets current user notifications
     * @param  {string} startDate
     * @param  {string} endDate
     * @returns Promise
     */
    getSentNotifications: (_startDate: string, _endDate: string): Promise<Array<Notification>> =>
    // TODO creare un tipo per i params e passarli
    // TODO scrivere il tipo di ritorno
    (apiClient.get<any>("/delivery/notifications/sent")
        .then((response) => response.data))
};