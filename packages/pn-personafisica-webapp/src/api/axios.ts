import axios from 'axios';
import { store } from '../redux/store';
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
    const token = store.getState().userState.user.sessionToken;
    if (token && config.headers) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// apiClient.interceptors.request.use(
//   (config) => {
//     /* eslint-disable functional/immutable-data */
//     // const token = JSON.parse(sessionStorage.getItem('user') || '');
//     if (token && config.headers) {
//       config.headers.Authorization = 'Bearer ' + (token.sessionToken as string);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
