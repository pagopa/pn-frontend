const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const API_BASE_URL = process.env.REACT_APP_URL_API;

export const URL_FE_LOGIN = process.env.REACT_APP_URL_FE_LOGIN;

export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;

export const CHECKOUT_URL = process.env.REACT_APP_CHECKOUT_URL;

export const PAYMENT_DISCLAIMER_URL = process.env.REACT_APP_PAYMENT_DISCLAIMER_URL;

export const ENABLE_ASSISTANCE = process.env.REACT_APP_ENABLE_ASSISTANCE === 'true';
