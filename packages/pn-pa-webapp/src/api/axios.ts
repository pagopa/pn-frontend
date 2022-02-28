import { interceptErrors } from '@pagopa-pn/pn-commons';
import axios from 'axios';
import _ from 'lodash';

import { API_BASE_URL } from '../utils/constants';

export const authClient = axios.create({
  baseURL: API_BASE_URL,
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    /* eslint-disable functional/immutable-data */
    const token = JSON.parse(sessionStorage.getItem('user') || '');
    if (token && config.headers) {
      config.headers.Authorization = 'Bearer ' + (token.sessionToken as string);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use((response) => response, interceptErrors);
authClient.interceptors.response.use((response) => response, interceptErrors);
