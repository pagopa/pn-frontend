import { apiClient } from "../axios";
import { Notification, GetNotificationsParams, GetNotificationsResponse } from "../../redux/dashboard/types";
import { formatDate } from "./notifications.mapper";

export const NotificationsApi = {
    /**
     * Gets current user notifications
     * @param  {string} startDate
     * @param  {string} endDate
     * @returns Promise
     */
    getSentNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> => {
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

        // TODO: cambiare modello quando sarà pronto il be
        return apiClient.get<Array<Notification>>('/delivery/notifications/sent', { params: queryParams }).then((response) => {
            const notifications = response.data.map(d => ({
                ...d,
                sentAt: formatDate(d.sentAt)
            }));
            return {
                notifications,
                totalElements: 100
            };
        });
    }
};