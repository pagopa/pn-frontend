// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { ReactNode } from 'react';
import { vi } from 'vitest';

import { Configuration } from '@pagopa-pn/pn-commons';
import '@testing-library/jest-dom';

import { initAxiosClients } from './api/apiClients';
import { initStore } from './redux/store';

// This is a workaround related to this issue https://github.com/nickcolley/jest-axe/issues/147
const { getComputedStyle } = window;
// eslint-disable-next-line functional/immutable-data
window.getComputedStyle = (elt) => getComputedStyle(elt);

beforeAll(async () => {
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
    MOCK_USER: false,
    LOG_REDUX_ACTIONS: false,
    APP_VERSION: 'mock-version',
    SELFCARE_URL_FE_LOGIN: 'https://test.selfcare.pagopa.it/auth/login',
    SELFCARE_BASE_URL: 'https://test.selfcare.pagopa.it',
    IS_PAYMENT_ENABLED: false,
    DELEGATIONS_TO_PG_ENABLED: true,
    LANDING_SITE_URL: 'https://www.dev.notifichedigitali.it',
    DOD_DISABLED: false,
    IS_B2B_ENABLED: true,
  });
  initStore(false);
  initAxiosClients();
  // mock translations
  vi.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: (str: string, options?: { defaultValue: any }) => {
        if (Array.isArray(options?.defaultValue)) {
          return [str];
        }
        return str;
      },
      i18n: {
        language: 'it',
        changeLanguage: () => new Promise(() => {}),
      },
    }),
    Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
      <>
        {props.i18nKey} {props.components?.map((c) => c)}
      </>
    ),
    initReactI18next: {
      type: '3rdParty',
      init: () => {},
    },
  }));
});
