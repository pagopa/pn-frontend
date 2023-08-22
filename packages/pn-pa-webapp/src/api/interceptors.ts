import { EnhancedStore } from '@reduxjs/toolkit';
// import { NotificationStatus } from '@pagopa-pn/pn-commons';
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
      if (
        response.request?.responseURL ===
        'https://webapi.dev.notifichedigitali.it/delivery/notifications/sent/NRJP-NZRW-LDTL-202308-L-1'
      ) {
        const data = response.data as NotificationDetail;
        data.notificationStatus = NotificationStatus.CANCELLATION_IN_PROGRESS;
        data.timeline.push({
          elementId: 'NOTIFICATION_CANCELLATION_REQUEST.HYTD-ERPH-WDUE-202308-H-1',
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
      } else {
        return response;
      }
    },
    (error) => error
  );
};

// scrivere in pr gli iun  e l'utente per farlo provare ad andre
