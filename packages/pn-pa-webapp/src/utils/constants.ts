const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const API_BASE_URL = process.env.REACT_APP_URL_API;

export const SELFCARE_BASE_URL = process.env.REACT_APP_URL_SELFCARE_BASE;
export const SELFCARE_URL_FE_LOGIN = process.env.REACT_APP_URL_SELFCARE_LOGIN;
export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;

export const DISABLE_INACTIVITY_HANDLER = process.env.REACT_APP_DISABLE_INACTIVITY_HANDLER || true;

export const PARTY_MOCK = 'Comune di Milano';