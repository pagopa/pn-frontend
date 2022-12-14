export const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const API_BASE_URL = process.env.REACT_APP_URL_API;
export const SELFCARE_BASE_URL = process.env.REACT_APP_URL_SELFCARE_BASE;

export const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || 'DUMMY';

export const VERSION = process.env.REACT_APP_VERSION ?? '';