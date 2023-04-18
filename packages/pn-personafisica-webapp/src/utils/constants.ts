export const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const API_BASE_URL = process.env.REACT_APP_URL_API;

export const URL_FE_LOGIN = process.env.REACT_APP_URL_FE_LOGIN;
export const URL_FE_LOGOUT = `${URL_FE_LOGIN}logout`;

export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;

// PN-2029
// export const PAYMENT_DISCLAIMER_URL = process.env.REACT_APP_PAYMENT_DISCLAIMER_URL;

export const LANDING_SITE_URL = process.env.REACT_APP_LANDING_SITE_URL;

export const DISABLE_INACTIVITY_HANDLER = process.env.REACT_APP_DISABLE_INACTIVITY_HANDLER || true;

export const URL_FILE_PRIVACY_DISCLAIMER = process.env.REACT_APP_URL_FILE_PRIVACY_DISCLAIMER || '';
export const URL_FILE_TERMS_OF_SERVICE = process.env.REACT_APP_URL_FILE_TERMS_OF_SERVICE || '';

export const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || 'DUMMY';

export const OT_DOMAIN_ID = process.env.REACT_APP_ONETRUST_DOMAIN_ID || '';

export const VERSION = process.env.REACT_APP_VERSION ?? '';

export const ONE_TRUST_DRAFT_MODE = process.env.REACT_APP_ONE_TRUST_DRAFT_MODE === 'true';
export const ONE_TRUST_PP = process.env.REACT_APP_ONE_TRUST_PP || '';
export const ONE_TRUST_TOS = process.env.REACT_APP_ONE_TRUST_TOS || '';
export const ONE_TRUST_PARTICIPATING_ENTITIES =
  process.env.REACT_APP_ONE_TRUST_PARTICIPATING_ENTITIES || '';

// this will be removed when delegations to pg works correctly
export const DELEGATIONS_TO_PG_ENABLED = process.env.REACT_APP_DELEGATIONS_TO_PG_ENABLED;
