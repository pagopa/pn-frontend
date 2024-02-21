// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { expect } from 'vitest';

import { Configuration } from '@pagopa-pn/pn-commons';
import matchers from '@testing-library/jest-dom/matchers';

import { initAxiosClients } from './api/apiClients';
import { initStore } from './redux/store';

// inject jest-dom matchers into vitest,
// cfr. https://markus.oberlehner.net/blog/using-testing-library-jest-dom-with-vitest/
expect.extend(matchers);

// This is a workaround related to this issue https://github.com/nickcolley/jest-axe/issues/147
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

beforeAll(() => {
  Configuration.setForTest<any>({
    API_BASE_URL: 'mock-api-base-url',
    DISABLE_INACTIVITY_HANDLER: true,
    ONE_TRUST_DRAFT_MODE: false,
    ONE_TRUST_PARTICIPATING_ENTITIES: 'mocked-id',
    ONE_TRUST_PP: 'mocked-id',
    ONE_TRUST_TOS: 'mocked-id',
    OT_DOMAIN_ID: '29cc1c86-f2ef-494d-8242-9bec8009cd29',
    PAGOPA_HELP_EMAIL: 'assistenza@pn.it',
    IS_DEVELOP: false,
    MIXPANEL_TOKEN: 'DUMMY',
    LOG_REDUX_ACTIONS: false,
    APP_VERSION: 'mock-version',
    SELFCARE_URL_FE_LOGIN: 'mock-selfcare-login',
    SELFCARE_BASE_URL: 'mock-selfcare.base',
    IS_PAYMENT_ENABLED: false,
    DELEGATIONS_TO_PG_ENABLED: true,
    LANDING_SITE_URL: 'https://www.dev.notifichedigitali.it',
    PAGOPA_HELP_PP: 'https://www.fake-page.it',
  });
  initStore(false);
  initAxiosClients();
});
