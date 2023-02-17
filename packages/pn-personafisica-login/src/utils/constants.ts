import { ENV } from './env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTE_LOGIN = BASE_ROUTE + '/login';
export const ROUTE_LOGIN_ERROR = BASE_ROUTE + '/login/error';
export const ROUTE_SUCCESS = BASE_ROUTE + '/login/success';
export const ROUTE_PRIVACY_POLICY = BASE_ROUTE + '/informativa-privacy';
export const ROUTE_LOGOUT = ENV.URL_FE.LOGOUT;
export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;
export const OT_DOMAIN_ID = ENV.COOKIE.OT_DOMAIN_ID;

export const ONE_TRUST_DRAFT_MODE = process.env.REACT_APP_ONE_TRUST_DRAFT_MODE === 'true';
export const ONE_TRUST_PP = process.env.REACT_APP_ONE_TRUST_PP || '';
export const PF_URL = process.env.REACT_APP_PF_URL;
export const PG_URL = process.env.REACT_APP_PG_URL;

export const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || 'DUMMY';

export const VERSION = process.env.REACT_APP_VERSION ?? '';
