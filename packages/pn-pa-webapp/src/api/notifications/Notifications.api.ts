import { apiClient } from '../axios';
import { GetNotificationsParams, GetNotificationsResponse } from '../../redux/dashboard/types';
import { NotificationDetail, Legalfacts } from '../../redux/notification/types';
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
            result: notifications,
          };
        }
        return {
          result: [],
          moreResult: false,
          nextPagesKey: [],
        };
      });
  },
  /**
   * Gets current user notification detail
   * @param  {string} iun
   * @returns Promise
   */
  getSentNotification: (iun: string): Promise<NotificationDetail> =>
    apiClient.get<NotificationDetail>(`/delivery/notifications/sent/${iun}`).then((response) => {
      if (response.data) {
        const dataToSend = {
          ...response.data,
          sentAt: formatDate(response.data.sentAt),
        };
        /* eslint-disable functional/immutable-data */
        dataToSend.notificationStatusHistory.sort(
          (a, b) => new Date(b.activeFrom).getTime() - new Date(a.activeFrom).getTime()
        );
        dataToSend.timeline.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        /* eslint-enable functional/immutable-data */
        return dataToSend;
      }
      return {} as NotificationDetail;
    }),
  /**
   * Gets current user notification legal acts
   * @param  {string} iun
   * @returns Promise
   */
  getSentNotificationLegalfacts: (iun: string): Promise<Array<Legalfacts>> =>
    apiClient
      .get<Array<Legalfacts>>(`/delivery/notifications/sent/${iun}/legalfacts`)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
        return [] as Array<Legalfacts>;
      }),
  /**
   * Gets current user notification document
   * @param  {string} iun
   * @param  {number} documentIndex
   * @returns Promise
   */
    getSentNotificationDocument: (iun: string, documentIndex: number): Promise<{url: string}> =>
    apiClient
      .get<{url: string}>(`/delivery/notifications/sent/${iun}/documents/${documentIndex}`)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
        return {url : ''};
      }),
};
