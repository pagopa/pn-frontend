import {
  Notification,
  NotificationDetail,
  NotificationStatus,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';
import { EnhancedStore } from '@reduxjs/toolkit';

import { apiClient } from './apiClients';

export const setUpInterceptor = (store: EnhancedStore) => {
  apiClient.interceptors.request.use(
    (config) => {
      if (config.url === '/delivery-push/notifications/sent/cancel/PELM-VYNK-XVGV-202308-R-1') {
        return Promise.reject({ error: true, type: 'cancellation-200' });
      } else if (
        config.url === '/delivery-push/notifications/sent/cancel/XJTU-DJLJ-MEGE-202308-N-1'
      ) {
        return Promise.reject({ error: true, type: 'cancellation-409' });
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

  apiClient.interceptors.response.use(
    (response) => {
      if (
        response.request?.responseURL ===
        'https://webapi.dev.notifichedigitali.it/delivery/notifications/sent/NRJP-NZRW-LDTL-202308-L-1'
      ) {
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
        response.request?.responseURL ===
        'https://webapi.dev.notifichedigitali.it/delivery/notifications/sent/HYTD-ERPH-WDUE-202308-H-1'
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
      } else if (
        response.request?.responseURL.startsWith(
          'https://webapi.dev.notifichedigitali.it/delivery/notifications/sent?startDate'
        )
      ) {
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
      } else if (error.error && error.type === 'cancellation-409') {
        return Promise.reject({
          response: {
            status: 409,
            data: {
              errors: [
                {
                  code: 'PN_NOTIFICATION_ALREADY_CANCELLED',
                  element: null,
                  detail: 'string',
                },
              ],
            },
          },
        });
      } else if (error.error && error.type === 'cancellation-500') {
        return Promise.reject({
          response: {
            status: 500,
            data: {
              errors: [
                {
                  code: 'PN_GENERIC_CANCELLED_NOTIFICATION_ERROR',
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
