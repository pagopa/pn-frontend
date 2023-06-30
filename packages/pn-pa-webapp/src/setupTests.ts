// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// import { Configuration } from '@pagopa-pn/pn-commons';

beforeAll(async () => {
  const pnCommonsApi = await import('@pagopa-pn/pn-commons');
  const storeApi = await import('./redux/store');
  const apiClientsApi = await import('./api/apiClients');
  pnCommonsApi.Configuration.setForTest<any>({
    API_BASE_URL: "mock-api-base-url",
    DISABLE_INACTIVITY_HANDLER: true,
    ONE_TRUST_DRAFT_MODE: true,
    ONE_TRUST_PP: "365c84c5-9329-4ec5-89f5-e53572eda132",
    ONE_TRUST_TOS: "b0da531e-8370-4373-8bd2-61ddc89e7fa6",
    OT_DOMAIN_ID: "29cc1c86-f2ef-494d-8242-9bec8009cd29",
    PAGOPA_HELP_EMAIL: "assistenza@pn.it",
    IS_DEVELOP: false,
    MOCK_USER: false,
    LOG_REDUX_ACTIONS: false,
    APP_VERSION: 'mock-version',
    SELFCARE_URL_FE_LOGIN: 'mock-selfcare-login',
    SELFCARE_BASE_URL: 'mock-selfcare.base',
    IS_PAYMENT_ENABLED: false,
    MIXPANEL_TOKEN: 'DUMMY',
  });
  storeApi.initStore(false);
  apiClientsApi.initAxiosClients();
});

