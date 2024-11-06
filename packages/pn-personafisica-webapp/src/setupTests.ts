import { Configuration } from '@pagopa-pn/pn-commons';
import '@testing-library/jest-dom';

import { initAxiosClients } from './api/apiClients';
import { initStore } from './redux/store';

// This is a workaround related to this issue https://github.com/nickcolley/jest-axe/issues/147
const { getComputedStyle } = window;
// eslint-disable-next-line functional/immutable-data
window.getComputedStyle = (elt) => getComputedStyle(elt);

beforeAll(() => {
  Configuration.setForTest<any>({
    API_BASE_URL: 'https://webapi.test.notifichedigitali.it/',
    DISABLE_INACTIVITY_HANDLER: true,
    ONE_TRUST_DRAFT_MODE: false,
    ONE_TRUST_PARTICIPATING_ENTITIES: 'mocked-id',
    ONE_TRUST_PP: 'mocked-id',
    ONE_TRUST_TOS: 'mocked-id',
    ONE_TRUST_SERCQ_SEND_DRAFT_MODE: false,
    ONE_TRUST_TOS_SERCQ_SEND: 'mocked-id-sercq-send',
    OT_DOMAIN_ID: '29cc1c86-f2ef-494d-8242-9bec8009cd29',
    PAGOPA_HELP_EMAIL: 'assistenza@pn.it',
    IS_DEVELOP: false,
    MIXPANEL_TOKEN: 'DUMMY',
    LOG_REDUX_ACTIONS: false,
    APP_VERSION: 'mock-version',
    SELFCARE_URL_FE_LOGIN: 'https://test.selfcare.pagopa.it/auth/login',
    SELFCARE_BASE_URL: 'https://test.selfcare.pagopa.it',
    IS_PAYMENT_ENABLED: false,
    DELEGATIONS_TO_PG_ENABLED: true,
    LANDING_SITE_URL: 'https://www.dev.notifichedigitali.it',
    PAGOPA_HELP_PP: 'https://www.fake-page.it',
    APP_IO_SITE: 'https://www.fake.appio.it',
    APP_IO_ANDROID: 'https://www.fake.android-appio.it',
    APP_IO_IOS: 'https://www.fake.ios-appio.it',
  });
  initStore(false);
  initAxiosClients();
});
