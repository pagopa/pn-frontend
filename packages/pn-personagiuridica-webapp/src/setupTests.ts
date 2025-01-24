// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { Configuration } from '@pagopa-pn/pn-commons';
import '@testing-library/jest-dom';

import { initAxiosClients } from './api/apiClients';
import { initStore } from './redux/store';
import { PgConfiguration } from './services/configuration.service';

// This is a workaround related to this issue https://github.com/nickcolley/jest-axe/issues/147
const { getComputedStyle } = window;
// eslint-disable-next-line functional/immutable-data
window.getComputedStyle = (elt) => getComputedStyle(elt);

beforeAll(async () => {
  Configuration.setForTest<PgConfiguration>({
    API_BASE_URL: 'https://webapi.test.notifichedigitali.it/',
    IS_INACTIVITY_HANDLER_ENABLED: false,
    ONE_TRUST_DRAFT_MODE: false,
    ONE_TRUST_PP: 'mocked-id',
    ONE_TRUST_TOS: 'mocked-id',
    ONE_TRUST_SERCQ_SEND_DRAFT_MODE: false,
    ONE_TRUST_TOS_SERCQ_SEND: 'mocked-id-sercq-send',
    OT_DOMAIN_ID: '29cc1c86-f2ef-494d-8242-9bec8009cd29',
    PAGOPA_HELP_EMAIL: 'assistenza@pn.it',
    MIXPANEL_TOKEN: 'DUMMY',
    SELFCARE_BASE_URL: 'https://test.selfcare.pagopa.it',
    DELEGATIONS_TO_PG_ENABLED: true,
    LANDING_SITE_URL: 'https://www.dev.notifichedigitali.it',
    IS_DOD_ENABLED: true,
    IS_B2B_ENABLED: true,
    ONE_TRUST_MASSIVI_DRAFT_MODE: false,
    ONE_TRUST_TOS_MASSIVI: '39cc1c86-f2ef-494d-8242-9bec8009cd23',
    WORK_IN_PROGRESS: false,
    F24_DOWNLOAD_WAIT_TIME: 0,
    DOWNTIME_EXAMPLE_LINK: 'https://www.example.com',
  });
  initStore(false);
  initAxiosClients();
});
