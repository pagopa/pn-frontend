import { ENV } from './env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTE_LOGIN = BASE_ROUTE + '/login';
export const ROUTE_LOGIN_SUCCESS = BASE_ROUTE + '/login/success';
export const ROUTE_LOGIN_ERROR = BASE_ROUTE + '/login/error';
export const ROUTE_LOGOUT = ENV.URL_FE.LOGOUT;

export const ENABLE_LANDING_REDIRECT = !ENV.URL_FE.LANDING.endsWith('/auth/logout');
