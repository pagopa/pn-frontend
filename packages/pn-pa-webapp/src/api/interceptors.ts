import { EnhancedStore } from "@reduxjs/toolkit";
import { apiClient } from "./apiClients";

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
};