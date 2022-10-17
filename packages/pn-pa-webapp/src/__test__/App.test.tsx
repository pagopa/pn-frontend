import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { act, screen } from '@testing-library/react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

/* eslint-disable import/order */
import { render, axe } from './test-utils';
import App from '../App';
import { Party } from '../models/party';
import { AUTH_ACTIONS } from '../redux/auth/actions';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
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

// mocko SessionGuard perché produce problemi nel test
jest.mock('../navigation/SessionGuard', () => () => <div>Session Guard</div>);

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

const reduxInitialState = {
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
  },
};

describe('App', () => {
  beforeAll(() => {
    mockLayout = false;
  });

  it('Piattaforma notifiche', () => {
    render(<Component/>, { preloadedState: reduxInitialState });
    const welcomeElement = screen.getByText(/header.notification-platform/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it('Test if automatic accessibility tests passes', async () => {
    const { container } = render(<Component/>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });

  it('Sidemenu not included if error in API call to fetch organization', async () => {
    mockLayout = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState, 
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_ORGANIZATION_PARTY) 
    };
    await act(async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError }));
    const sidemenuComponent = screen.queryByText("sidemenu");
    expect(sidemenuComponent).toBeNull();
  });
});

export {};
