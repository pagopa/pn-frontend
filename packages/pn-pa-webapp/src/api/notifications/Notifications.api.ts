import { apiClient } from "../axios";
import { Notification, GetNotificationsParams } from "../../redux/dashboard/types";
import { formatDate } from "./notifications.mapper";

export const NotificationsApi = {
    /**
     * Gets current user notifications
     * @param  {string} startDate
     * @param  {string} endDate
     * @returns Promise
     */
    getSentNotifications: (params: GetNotificationsParams): Promise<Array<Notification>> => {
        const queryParams = new URLSearchParams();
        queryParams.append('startDate', params.startDate);
        queryParams.append('endDate', params.endDate);
        if (params.recipientId) {
            queryParams.append('recipientId', params.recipientId);
        }
        if (params.status) {
            queryParams.append('status', params.status);
        }
        if (params.subjectRegExp) {
            queryParams.append('subjectRegExp', params.subjectRegExp);
        }

        return apiClient.get<Array<Notification>>("/delivery/notifications/sent", { params: queryParams }).then((response) => (
            response.data.map(d => ({
                ...d,
                sentAt: formatDate(d.sentAt)
            }))
        ));
    }
};