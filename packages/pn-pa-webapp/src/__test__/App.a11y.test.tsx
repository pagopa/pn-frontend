import * as React from 'react';

import { ThemeProvider } from '@emotion/react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { currentStatusOk } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { axe, render } from './test-utils';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

jest.mock('../pages/Dashboard.page', () => () => <div>Generic Page</div>);

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

const reduxInitialState = {
  userState: {
    user: userResponse,
    fetchedTos: false,
    fetchedPrivacy: false,
    tosConsent: {
      accepted: false,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
    privacyConsent: {
      accepted: false,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
  },
};

describe('App - accessbility tests', () => {
  it('Test if automatic accessibility tests passes - user not logged in', async () => {
    const { container } = render(<Component />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });

  it('Test if automatic accessibility tests passes - user logged in', async () => {
    const { container } = render(<Component />, {
      preloadedState: {
        userState: {
          ...reduxInitialState.userState,
          fetchedTos: true,
          fetchedPrivacy: true,
          tosConsent: { ...reduxInitialState.userState.tosConsent, accepted: true },
          privacyConsent: { ...reduxInitialState.userState.privacyConsent, accepted: true },
        },
        appStatus: {
          currentStatus: currentStatusOk,
        },
      },
    });
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  }, 15000);

  it('Test if automatic accessibility tests passes - errors on API call', async () => {
    const { container } = render(<Component />, {
      preloadedState: {
        userState: {
          ...reduxInitialState.userState,
          fetchedPrivacy: true,
          privacyConsent: { ...reduxInitialState.userState.privacyConsent, accepted: true },
        },
        appStatus: {
          currentStatus: currentStatusOk,
        },
        appState: apiOutcomeTestHelper.appStateWithMessageForAction('getConsentByType'),
      },
    });
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  }, 15000);
});
