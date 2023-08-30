import { EnhancedStore } from '@reduxjs/toolkit';
import { NotificationDetail, NotificationStatus, TimelineCategory } from '@pagopa-pn/pn-commons';
import { apiClient } from './apiClients';

export const setUpInterceptor = (store: EnhancedStore) => {
  apiClient.interceptors.request.use(
    (config) => {
      /* eslint-disable functional/immutable-data */
      const token: string = store.getState().userState.user.sessionToken;
      if (token && config.headers) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  apiClient.interceptors.response.use(
    (response) => {
      if (response.config?.url === '/delivery/notifications/received/ZYJX-NWHZ-VAVQ-202307-U-1') {
        const data = response.data as NotificationDetail;
        data.notificationStatus = NotificationStatus.CANCELLED;
        data.notificationStatusHistory.push({
          status: NotificationStatus.CANCELLED,
          activeFrom: '2043-08-15T13:42:54.17675939Z',
          relatedTimelineElements: [],
        });
        data.timeline.push({
          elementId: 'NOTIFICATION_CANCELLED.ZYJX-NWHZ-VAVQ-202307-U-1',
          timestamp: '2033-08-14T13:42:54.17675939Z',
          legalFactsIds: [],
          category: TimelineCategory.NOTIFICATION_CANCELLED,
          details: {},
        });
        return {
          data,
          status: response.status,
          statusText: '',
          headers: response.headers,
          config: response.config,
          request: response.request,
        };
      } else {
        return response;
      }
    },
    (error) => error
  );
};
