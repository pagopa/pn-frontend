import { apiClient } from '../axios';
import {
  GetNotificationsParams,
  GetNotificationsResponse,
} from '../../redux/dashboard/types';
import { formatDate } from './notifications.mapper';

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
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }
    if (params.nextPagesKey) {
      queryParams.append('nextPagesKey', params.nextPagesKey);
    }
    return apiClient
      .get<GetNotificationsResponse>('/delivery/notifications/sent', { params: queryParams })
      .then((response) => {
        if (response.data && response.data.result) {
          const notifications = response.data.result.map((d) => ({
            ...d,
            sentAt: formatDate(d.sentAt),
          }));
          return {
            ...response.data,
            result: notifications
          };
        }
        return {
          result: [],
          moreResult: false,
          nextPagesKey: []
        };
      });
  },
};
