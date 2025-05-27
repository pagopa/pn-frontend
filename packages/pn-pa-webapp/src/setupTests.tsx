// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { ReactNode } from 'react';
import { vi } from 'vitest';
import 'vitest-canvas-mock';

import { Configuration } from '@pagopa-pn/pn-commons';
import '@testing-library/jest-dom';

import { initAxiosClients } from './api/apiClients';
import { initStore } from './redux/store';
import { PaConfiguration } from './services/configuration.service';
import { PhysicalAddressLookupConfig } from './models/NewNotification';

beforeAll(() => {
  Configuration.setForTest<PaConfiguration>({
    API_BASE_URL: 'https://mock-api-base-url',
    IS_INACTIVITY_HANDLER_ENABLED: false,
    ONE_TRUST_DRAFT_MODE: true,
    ONE_TRUST_PP: '365c84c5-9329-4ec5-89f5-e53572eda132',
    ONE_TRUST_TOS: 'b0da531e-8370-4373-8bd2-61ddc89e7fa6',
    OT_DOMAIN_ID: '29cc1c86-f2ef-494d-8242-9bec8009cd29',
    PAGOPA_HELP_EMAIL: 'assistenza@pn.it',
    SELFCARE_URL_FE_LOGIN: 'https://test.selfcare.pagopa.it/auth/login',
    SELFCARE_BASE_URL: 'https://test.selfcare.pagopa.it',
    SELFCARE_SEND_PROD_ID: 'prod-pn-test',
    IS_PAYMENT_ENABLED: false,
    MIXPANEL_TOKEN: 'DUMMY',
    IS_MANUAL_SEND_ENABLED: true,
    IS_STATISTICS_ENABLED: true,
    WORK_IN_PROGRESS: false,
    API_B2B_LINK: 'https://test.b2b.pagopa.it',
    TAXONOMY_SEND_URL: 'https://test.taxonomy.pagopa.it',
    DOWNTIME_EXAMPLE_LINK: 'https://test.downtime.pagopa.it',
    LANDING_SITE_URL: 'https://test.landing.pagopa.it',
    PAYMENT_INFO_LINK: 'https://test.payment.pagopa.it',
    DEVELOPER_API_DOCUMENTATION_LINK: 'https://test.api.pagopa.it',
    PHYSICAL_ADDRESS_LOOKUP: PhysicalAddressLookupConfig.ON,
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
