import { act, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

/* eslint-disable import/order */
import { render } from './test-utils';
import App from '../App';
import { Party } from '../models/party';
import { AUTH_ACTIONS } from '../redux/auth/actions';

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


/* eslint-disable functional/no-let */
let mockFetchedTosStatus = false;
let mockTosStatus = false;

const reduxInitialState = () => ({
  userState: {
    user: {
      fiscal_number: 'mocked-fiscal-number',
      name: 'mocked-name',
      family_name: 'mocked-family-name',
      email: 'mocked-user@mocked-domain.com',
      sessionToken: 'mocked-token',
    },
    organizationParty: {
      id: '',
      name: '',
    } as Party,
    fetchedTos: mockFetchedTosStatus,
    tos: mockTosStatus,
  },
});

describe('App', () => {
  beforeEach(() => {
    mockLayout = false;
    mockFetchedTosStatus = false;
    mockTosStatus = false;
  });

  it('Piattaforma notifiche', () => {
    render(<Component/>, { preloadedState: reduxInitialState() });
    const welcomeElement = screen.getByText(/header.notification-platform/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it('Sidemenu not included if error in API call to fetch organization', async () => {
    mockLayout = true;
    mockFetchedTosStatus = true;
    mockTosStatus = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState(),
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_ORGANIZATION_PARTY)
    };
    await act(async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });

  it('Sidemenu not included if error in API call to fetch TOS', async () => {
    mockLayout = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState(),
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_TOS_APPROVAL)
    };
    await act(async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });

  it('Sidemenu not included if user has not accepted the TOS', async () => {
    mockLayout = true;
    mockFetchedTosStatus = true;
    mockTosStatus = false;
    await act(async () => void render(<Component />, { preloadedState: reduxInitialState() }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });

  it('Sidemenu included if user has accepted the TOS', async () => {
    mockLayout = true;
    mockFetchedTosStatus = true;
    mockTosStatus = true;
    await act(async () => void render(<Component />, { preloadedState: reduxInitialState() }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeTruthy();
  });
});

export {};
