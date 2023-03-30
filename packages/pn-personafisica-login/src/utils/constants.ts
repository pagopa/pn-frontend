import { ENV } from './env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTE_LOGIN = BASE_ROUTE + '/login';
export const ROUTE_LOGIN_ERROR = BASE_ROUTE + '/login/error';
export const ROUTE_SUCCESS = BASE_ROUTE + '/login/success';
export const ROUTE_PRIVACY_POLICY = BASE_ROUTE + '/informativa-privacy';
export const ROUTE_LOGOUT = ENV.URL_FE.LOGOUT;

export const VERSION = process.env.REACT_APP_VERSION ?? '';
