import { EnhancedStore } from '@reduxjs/toolkit';
import { paymentInfo } from '../__mocks__/ExternalRegistry.mock';
import { notificationDTO } from '../__mocks__/NotificationDetail.mock';
import { apiClient } from './apiClients';

export const setUpInterceptor = (store: EnhancedStore) => {
  apiClient.interceptors.request.use(
    (config) => {
      if (config.url === '/delivery/v2/notifications/received/AVEJ-AUAT-JUQE-202305-J-1') {
        return Promise.reject({ error: true, type: 'delivery' });
      }
      if (config.url === '/ext-registry/pagopa/v2/paymentinfo') {
        return new Promise((_resolve, reject) =>
          setTimeout(() => reject({ error: true, type: 'ext-registry' }), 500)
        );
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
    (response) => response,
    (error) => {
      if (error.error) {
        if (error.type === 'delivery') {
          return { data: notificationDTO };
        }
        if (error.type === 'ext-registry') {
          return { data: paymentInfo };
        }
      }
      return error;
    }
  );
};
