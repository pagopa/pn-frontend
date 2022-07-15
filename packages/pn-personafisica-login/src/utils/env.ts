import * as env from 'env-var';

const PUBLIC_URL: string = env.get('PUBLIC_URL').default('').asString();

export const ENV = {
  PUBLIC_URL,

  ASSISTANCE: {
    ENABLE: env.get('REACT_APP_ENABLE_ASSISTANCE').required().asBool(),
    EMAIL: env.get('REACT_APP_PAGOPA_HELP_EMAIL').required().asString(),
  },

  URL_FE: {
    LOGOUT: PUBLIC_URL + '/logout',
  },

  URL_API: {
    LOGIN: env.get('REACT_APP_URL_API_LOGIN').required().asString(),
  },

  URL_FILE: {
    PRIVACY_DISCLAIMER: env.get('REACT_APP_URL_FILE_PRIVACY_DISCLAIMER').required().asString(),
    TERMS_AND_CONDITIONS: env.get('REACT_APP_URL_FILE_TERMS_AND_CONDITIONS').required().asString(),
  },

  SPID_TEST_ENV_ENABLED: env.get('REACT_APP_SPID_TEST_ENV_ENABLED').required().asBool(),

  SPID_CIE_ENTITY_ID: env.get('REACT_APP_SPID_CIE_ENTITY_ID').required().asString(),

  ANALYTCS: {
    TOKEN: env.get('REACT_APP_MIXPANEL_TOKEN').required().asString()
  },

  COOKIE: {
    OT_DOMAIN_ID: env.get('REACT_APP_ONETRUST_DOMAIN_ID').required().asString()
  }
};
