import { EnhancedStore } from '@reduxjs/toolkit';
import { notificationDTOMultiRecipient } from '../__mocks__/NotificationDetail.mock';
import { apiClient } from './apiClients';

export const setUpInterceptor = (store: EnhancedStore) => {
  apiClient.interceptors.request.use(
    (config) => {
      if (config.url === '/delivery/v2.0/notifications/sent/TJUN-ATLX-UNQN-202307-L-1') {
        return Promise.reject({ error: true, type: 'delivery' });
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
      if (error.error && error.type === 'delivery') {
        console.log("INTERCEPTOR: error.error && error.type === 'delivery'", error);
        return { data: notificationDTOMultiRecipient };
      }
      return error;
    }
  );
};
