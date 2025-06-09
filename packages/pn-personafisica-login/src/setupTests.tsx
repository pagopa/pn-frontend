// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { ReactNode } from 'react';
import { vi } from 'vitest';

import { Configuration } from '@pagopa-pn/pn-commons';
import '@testing-library/jest-dom';

import { LoginConfiguration } from './services/configuration.service';

beforeAll(async () => {
  Configuration.setForTest<LoginConfiguration>({
    MIXPANEL_TOKEN: 'ba1f5101fe34a61bb125cbfe587780d8',
    OT_DOMAIN_ID: 'fd5aef6f-a6d3-422b-87b7-aa5e2cb6510c-test',
    PAGOPA_HELP_EMAIL: 'destinatari-send@assistenza.pagopa.it',
    PF_URL: 'https://cittadini.dev.notifichedigitali.it',
    SPID_TEST_ENV_ENABLED: true,
    SPID_VALIDATOR_ENV_ENABLED: true,
    SPID_CIE_ENTITY_ID: 'xx_servizicie_test',
    URL_API_LOGIN: 'https://hub-login.spid.dev.notifichedigitali.it',
    APP_IO_SITE: 'https://io.italia.it/',
    APP_IO_ANDROID: 'https://play.google.com/store/apps/details?id=it.pagopa.io.app',
    APP_IO_IOS: 'https://apps.apple.com/it/app/io/id1501681835',
    IS_SMART_APP_BANNER_ENABLED: true,
  });
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
