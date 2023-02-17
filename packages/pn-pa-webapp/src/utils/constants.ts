export const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const API_BASE_URL = process.env.REACT_APP_URL_API;

export const SELFCARE_BASE_URL = process.env.REACT_APP_URL_SELFCARE_BASE;
export const SELFCARE_URL_FE_LOGIN = process.env.REACT_APP_URL_SELFCARE_LOGIN;
export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;

export const DISABLE_INACTIVITY_HANDLER = process.env.REACT_APP_DISABLE_INACTIVITY_HANDLER || true;

export const OT_DOMAIN_ID =
  process.env.REACT_APP_ONETRUST_DOMAIN_ID || 'fd5aef6f-a6d3-422b-87b7-aa5e2cb6510c';

export const ONE_TRUST_DRAFT_MODE = process.env.REACT_APP_ONE_TRUST_DRAFT_MODE === 'true';
export const ONE_TRUST_PP = process.env.REACT_APP_ONE_TRUST_PP || '';
export const ONE_TRUST_TOS = process.env.REACT_APP_ONE_TRUST_TOS || '';
export const IS_PAYMENT_ENABLED = process.env.REACT_APP_IS_PAYMENT_ENABLED === 'true';
export const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || 'DUMMY';
export const VERSION = process.env.REACT_APP_VERSION ?? '';
