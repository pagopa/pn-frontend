import axios, { AxiosInstance } from 'axios';

import { getConfiguration } from "../services/configuration.service";

// eslint-disable-next-line functional/no-let
export let authClient: AxiosInstance;

// eslint-disable-next-line functional/no-let
export let apiClient: AxiosInstance;

export function initAxiosClients() {
  authClient = axios.create({
    baseURL: getConfiguration().API_BASE_URL,
  });

  apiClient = axios.create({
    baseURL: getConfiguration().API_BASE_URL,
  });
}
