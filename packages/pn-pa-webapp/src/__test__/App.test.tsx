import { act, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

/* eslint-disable import/order */
import { render } from './test-utils';
import App from '../App';
import { Party } from '../models/party';
import { AUTH_ACTIONS } from '../redux/auth/actions';
import React from 'react';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let mockLayout = false;

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  const OriginalLayout = original.Layout;
  return {
    ...original,
    Layout: (props: any) => mockLayout
      ? <div>{ props.showSideMenu ? "sidemenu" : ""}</div>
      : <OriginalLayout {...props} />,
  };
});

jest.mock('../api/appStatus/AppStatus.api', () => {
  const original = jest.requireActual('../api/consents/Consents.api');
  return {
    ...original,
    AppStatusApi: {
      getCurrentStatus: () => Promise.resolve({
        appIsFullyOperative: true,
        statusByFunctionality: [],  
        lastCheckTimestamp: '2022-11-01T14:15:28Z',
      }),
      getDowntimeLogPage: () => Promise.resolve({
        downtimes: [],
        statusByFunctionality: [],     
      }),
    },
  };
});

// mocko SessionGuard perché produce problemi nel test
jest.mock('../navigation/SessionGuard', () => () => <div>Session Guard</div>);
jest.mock('../navigation/ToSGuard', () => () => <div>ToS Guard</div>);

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

const reduxInitialState = (
  fetchedTos: boolean,
  fetchedPrivacy: boolean,
  acceptedTos: boolean,
  acceptedPrivacy: boolean
) => ({
  userState: {
    user: {
      fiscal_number: 'mocked-fiscal-number',
      name: 'mocked-name',
      family_name: 'mocked-family-name',
      email: 'mocked-user@mocked-domain.com',
      sessionToken: 'mocked-token',
    },
    fetchedTos,
    fetchedPrivacy,
    tosConsent: {
      accepted: acceptedTos,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1'
    },
    privacyConsent: {
      accepted: acceptedPrivacy,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1'
    }
  },
});

describe('App', () => {
  beforeEach(() => {
    mockLayout = false;
  });

  it('SEND', () => {
    render(<Component/>, { preloadedState: reduxInitialState(false, false, false, false) });
    const welcomeElement = screen.getByText(/header.notification-platform/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it('Sidemenu not included if error in API call to fetch organization', async () => {
    mockLayout = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState(true, true, false, false),
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_ORGANIZATION_PARTY)
    };
    await act(async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });

  it('Sidemenu not included if error in API call to fetch TOS', async () => {
    mockLayout = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState(true, true, false, false),
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_TOS_APPROVAL)
    };
    await act(async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });

  it('Sidemenu not included if error in API call to fetch PRIVACY', async () => {
    mockLayout = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState(true, true, false, false),
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_PRIVACY_APPROVAL)
    };
    await act(async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });

  it('Sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
    mockLayout = true;
    await act(async () => void render(<Component />, { preloadedState: reduxInitialState(true, true, false, false) }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });

  it('Sidemenu included if user has accepted the TOS and PRIVACY', async () => {
    mockLayout = true;
    await act(async () => void render(<Component />, { preloadedState: reduxInitialState(true, true, true, true) }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeTruthy();
  });
});

export {};
