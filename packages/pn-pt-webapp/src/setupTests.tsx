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
import { PtConfiguration } from './services/configuration.service';

const originalWarn = console.warn;
// eslint-disable-next-line functional/immutable-data
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
    return;
  }
  originalWarn(...args);
};

beforeAll(() => {
  Configuration.setForTest<PtConfiguration>({
    API_BASE_URL: 'https://mock-api-base-url/',
    PAGOPA_HELP_EMAIL: 'assistenza@pn.it',
    ACCESSIBILITY_LINK: 'https://accessibility-link.it',
    SERCQ_SERVICE_STATEMENT_LINK: 'https://fake.sercq-service-statement.pagopa.it',
    SELFCARE_BASE_URL: 'https://test.selfcare.pagopa.it',
    INACTIVITY_HANDLER_MINUTES: 0,
    WORK_IN_PROGRESS: false,
    LANDING_SITE_URL: 'https://test.landing.pagopa.it',
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
        exists: () => true,
      },
    }),
    Trans: (props: { i18nKey: string; components?: Array<ReactNode>; children?: ReactNode }) => (
      <>
        {props.i18nKey} {props.components?.map((c) => c)} {props.children}
      </>
    ),
    initReactI18next: {
      type: '3rdParty',
      init: () => {},
    },
  }));
});
