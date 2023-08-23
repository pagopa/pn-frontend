import {
  Notification,
  NotificationDetail,
  NotificationStatus,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';
import { EnhancedStore } from '@reduxjs/toolkit';

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
      if (config.url === '/delivery-push/notifications/sent/cancel/PELM-VYNK-XVGV-202308-R-1') {
        return Promise.reject({ error: true, type: 'cancellation-200' });
      } else if (config.url?.startsWith('/delivery-push/notifications/sent/cancel/')) {
        return Promise.reject({ error: true, type: 'cancellation-500' });
      }
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
      if (response.config?.url === '/delivery/notifications/sent/NRJP-NZRW-LDTL-202308-L-1') {
        const data = response.data as NotificationDetail;
        data.notificationStatus = NotificationStatus.CANCELLATION_IN_PROGRESS;
        data.timeline.push({
          elementId: 'NOTIFICATION_CANCELLATION_REQUEST.NRJP-NZRW-LDTL-202308-L-1',
          timestamp: '2033-08-14T13:42:54.17675939Z',
          legalFactsIds: [],
          category: TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST,
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
      } else if (
        response.config?.url === '/delivery/notifications/sent/HYTD-ERPH-WDUE-202308-H-1'
      ) {
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
      } else if (response.config?.url?.startsWith('/delivery/notifications/sent?startDate')) {
        const data = response.data as { resultsPage: Array<Notification> };
        const specificIun = data.resultsPage.find(
          (el: Notification) => el.iun === 'HYTD-ERPH-WDUE-202308-H-1'
        );
        if (specificIun) {
          specificIun.notificationStatus = NotificationStatus.CANCELLED;
        }
        return {
          data,
          status: response.status,
          statusText: '',
          headers: response.headers,
          config: response.config,
          request: response.request,
        };
      }
      return response;
    },
    (error) => {
      if (error.error && error.type === 'cancellation-200') {
        return { data: undefined };
      } else if (error.error && error.type === 'cancellation-500') {
        return Promise.reject({
          response: {
            status: 500,
            data: {
              errors: [
                {
                  code: 'PN_GENERIC_ERROR',
                  element: null,
                  detail: 'string',
                },
              ],
            },
          },
        });
      }
      return Promise.reject(error);
    }
  );
};
