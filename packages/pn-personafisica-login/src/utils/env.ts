import * as env from 'env-var';

const PUBLIC_URL: string = env.get('PUBLIC_URL').default('').asString();

export const ENV = {
  PUBLIC_URL,

  URL_FE: {
    LOGOUT: PUBLIC_URL + '/logout',
  },

  URL_API: {
    LOGIN: env.get('REACT_APP_URL_API_LOGIN').required().asString(),
  },

  SPID_TEST_ENV_ENABLED: env.get('REACT_APP_SPID_TEST_ENV_ENABLED').required().asBool(),

  SPID_VALIDATOR_ENV_ENABLED: env.get('REACT_APP_SPID_VALIDATOR_ENV_ENABLED').required().asBool(),

  SPID_CIE_ENTITY_ID: env.get('REACT_APP_SPID_CIE_ENTITY_ID').required().asString(),
};
