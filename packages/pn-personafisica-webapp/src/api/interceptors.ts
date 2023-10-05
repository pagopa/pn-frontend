import { EnhancedStore } from '@reduxjs/toolkit';

import { paymentInfo } from '../__mocks__/ExternalRegistry.mock';
import { notificationDTO } from '../__mocks__/NotificationDetail.mock';
import { apiClient } from './apiClients';

export const setUpInterceptor = (store: EnhancedStore) => {
  apiClient.interceptors.request.use(
    (config) => {
      if (config.url === '/delivery/v2.1/notifications/received/PXPX-PQZU-PHPQ-202306-M-1') {
        return Promise.reject({ error: true, type: 'delivery' });
      }
      if (config.url === '/ext-registry/pagopa/v2/paymentinfo') {
        return new Promise((_resolve, reject) =>
          setTimeout(() => reject({ error: true, type: 'ext-registry' }), 2000)
        );
      }
      if (
        config.url ===
        '/delivery/notifications/received/DAPQ-LWQV-DKQH-202308-A-1/attachments/payment/F24?attachmentIdx=4'
      ) {
        return new Promise((_resolve, reject) =>
          setTimeout(() => reject({ error: true, type: 'delivery-f24' }), 2000)
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
        if (error.type === 'delivery-f24') {
          return {
            data: {
              filename: 'Rata 1 F24.pdf',
              contentLength: 10,
              contenType: 'application/pdf',
              sha256: 'sha256',
              // url: 'https://www.africau.edu/images/default/sample.pdf',
              retryAfter: 14000,
            },
          };
        }
      }
      return error;
    }
  );
};
