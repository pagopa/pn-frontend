import * as env from 'env-var';

const PUBLIC_URL: string = env.get('PUBLIC_URL').default('').asString();

export const ENV = {
  PUBLIC_URL,

  ASSISTANCE: {
    ENABLE: env.get('REACT_APP_ENABLE_ASSISTANCE').required().asBool(),
    EMAIL: env.get('REACT_APP_PAGOPA_HELP_EMAIL').required().asString(),
  },

  URL_FE: {
    LANDING: env.get('REACT_APP_URL_FE_LANDING').required().asString(),
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

  // ANALYTCS: {
  //   ENABLE: env.get('REACT_APP_ANALYTICS_ENABLE').default('false').asBool(),
  //   MOCK: env.get('REACT_APP_ANALYTICS_MOCK').default('false').asBool(),
  //   DEBUG: env.get('REACT_APP_ANALYTICS_DEBUG').default('false').asBool(),
  //   TOKEN: env.get('REACT_APP_MIXPANEL_TOKEN').required().asString(),
  //   API_HOST: env
  //     .get('REACT_APP_MIXPANEL_API_HOST')
  //     .default('https://api-eu.mixpanel.com')
  //     .asString(),
  // },
};
