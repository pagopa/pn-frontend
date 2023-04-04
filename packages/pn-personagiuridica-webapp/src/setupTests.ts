// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// This is a workaround related to this issue https://github.com/nickcolley/jest-axe/issues/147
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

beforeAll(async () => {
  const pnCommonsApi = await import('@pagopa-pn/pn-commons');

  pnCommonsApi.Configuration.setForTest<any>({
    API_BASE_URL: "mock-api-base-url",
    DISABLE_INACTIVITY_HANDLER: true,
    ONE_TRUST_DRAFT_MODE: false,
    ONE_TRUST_PARTICIPATING_ENTITIES: "mocked-id",
    ONE_TRUST_PP: "mocked-id",
    ONE_TRUST_TOS: "mocked-id",
    OT_DOMAIN_ID: "29cc1c86-f2ef-494d-8242-9bec8009cd29",
    PAGOPA_HELP_EMAIL: "assistenza@pn.it",
    IS_DEVELOP: false,
    MIXPANEL_TOKEN: "DUMMY",
    MOCK_USER: false,
    LOG_REDUX_ACTIONS: false,
    APP_VERSION: 'mock-version',
    SELFCARE_URL_FE_LOGIN: 'mock-selfcare-login',
    SELFCARE_BASE_URL: 'mock-selfcare.base',
    IS_PAYMENT_ENABLED: false,
    URL_FE_LOGIN: "https://portale-login.dev.pn.pagopa.it/"
  });

  // this avoids the store initialization for a test in which we must set
  // the sessionStorage before performing the initialization
  if (expect.getState().testPath.endsWith('initialState_ok.test.ts')) {
    return
  }
  const storeApi = await import('./redux/store');
  const apiClientsApi = await import('./api/apiClients');
  storeApi.initStore(false);
  apiClientsApi.initAxiosClients();
});

