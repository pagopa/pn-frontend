import { EnhancedStore } from '@reduxjs/toolkit';
import { NotificationDetail, NotificationStatus, TimelineCategory } from '@pagopa-pn/pn-commons';
import { apiClient } from './apiClients';

// eslint-disable-next-line functional/no-let
let axiosResponseInterceptor: number; // outer variable
// eslint-disable-next-line functional/no-let
let axiosRequestInterceptor: number; // outer variable

const clearInterceptor = (interceptorInstance: number, method: 'request' | 'response') => {
  if (interceptorInstance >= 0) {
    apiClient.interceptors[method].eject(interceptorInstance);
  }
};

export const setUpInterceptor = (store: EnhancedStore) => {
  clearInterceptor(axiosRequestInterceptor, 'request');
  clearInterceptor(axiosResponseInterceptor, 'response');

  axiosRequestInterceptor = apiClient.interceptors.request.use(
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

  axiosResponseInterceptor = apiClient.interceptors.response.use(
    (response) => {
      if (response.config?.url === '/delivery/notifications/received/DKRU-XUDK-UERQ-202308-X-1') {
        const data = response.data as NotificationDetail;
        data.notificationStatus = NotificationStatus.CANCELLED;
        data.notificationStatusHistory.push({
          status: NotificationStatus.CANCELLED,
          activeFrom: '2043-08-15T13:42:54.17675939Z',
          relatedTimelineElements: [],
        });
        data.timeline.push({
          elementId: 'NOTIFICATION_CANCELLED.HYTD-ERPH-WDUE-202308-H-1',
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
