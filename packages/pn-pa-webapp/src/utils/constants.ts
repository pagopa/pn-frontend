const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const API_BASE_URL = process.env.REACT_APP_URL_API;

export const SELFCARE_URL_FE_LOGIN = process.env.REACT_APP_URL_SELFCARE_LOGIN;
export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;
export const ENABLE_ASSISTANCE = process.env.REACT_APP_ENABLE_ASSISTANCE === 'true';

const sUsrAg = navigator.userAgent;
export const IS_CHROME = sUsrAg.indexOf("Chrome") > -1;
export const IS_FIREFOX = sUsrAg.indexOf("Firefox") > -1;
export const IS_EXPLORER = sUsrAg.indexOf("Trident") > -1;
export const IS_EDGE = sUsrAg.indexOf("Edge") > -1;
export const IS_SAFARI = sUsrAg.indexOf("Safari") > -1;
export const IS_OPERA = sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1;
