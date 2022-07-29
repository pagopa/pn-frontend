import { ENV } from './env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTE_LOGIN = BASE_ROUTE + '/login';
export const ROUTE_LOGIN_ERROR = BASE_ROUTE + '/login/error';
export const ROUTE_LOGOUT = ENV.URL_FE.LOGOUT;
export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;
export const OT_DOMAIN_ID = ENV.COOKIE.OT_DOMAIN_ID;

export const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || "DUMMY";
