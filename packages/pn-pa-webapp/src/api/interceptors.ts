import { EnhancedStore } from '@reduxjs/toolkit';
import {
  Notification,
  NotificationDetail,
  NotificationStatus,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';
import { apiClient } from './apiClients';

export const setUpInterceptor = (store: EnhancedStore) => {
  apiClient.interceptors.request.use(
    (config) => {
      /* if (config.url === '/delivery-push/notifications/sent/cancel/PELM-VYNK-XVGV-202308-R-1') {
        return Promise.resolve({
          iun: 'PELM-VYNK-XVGV-202308-R-1',
        });
      } */
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
        response.request?.responseURL ===
        'https://webapi.dev.notifichedigitali.it/delivery/notifications/sent?startDate=2013-08-22T00%3A00%3A00.000Z&endDate=2023-08-23T00%3A00%3A00.000Z&size=10'
      ) {
        const data = response.data as { resultsPage: Array<Notification> };
        const specificIun = data.resultsPage.filter(
          (el: Notification) => el.iun === 'PELM-VYNK-XVGV-202308-R-1'
        )[0];
        specificIun.notificationStatus = NotificationStatus.CANCELLED;
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
    (error) =>
      /* console.log('error :>> ', error);
      if (error.iun === 'PELM-VYNK-XVGV-202308-R-1') {
        return {
          data: {
            status: 200,
            type: 'PN_NOTIFICATION_ALREADY_CANCELLED',
            title: '',
            detail: '',
            traceId: '',
            timestamp: 'string',
            errors: [
              { code: 'PN_NOTIFICATION_ALREADY_CANCELLED', element: null, detail: 'string' },
            ],
          },
        };
      } else {
        return error;
      }
    } */
      error
  );
};
