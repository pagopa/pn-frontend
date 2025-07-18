import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { tosPrivacyConsentMock } from '../__mocks__/Consents.mock';
import { digitalAddresses } from '../__mocks__/Contacts.mock';
import { apiClient, authClient } from '../api/apiClients';
import { DelegationStatus } from '../models/Deleghe';
import { PNRole, PartyRole } from '../models/User';
import { SELFCARE_LOGOUT } from '../navigation/routes.const';
import { getConfiguration } from '../services/configuration.service';
import { RenderResult, act, fireEvent, getByText, render, screen, waitFor } from './test-utils';

vi.mock('../pages/Notifiche.page', () => ({ default: () => <div>Generic Page</div> }));

const unmockedFetch = global.fetch;

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

describe('App', async () => {
  let mock: MockAdapter;
  let mockAuth: MockAdapter;
  let result: RenderResult;
  const mockOpenFn = vi.fn();
  const originalOpen = window.open;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    mockAuth = new MockAdapter(authClient);
    // FooterPreLogin (mui-italia) component calls an api to fetch selfcare products list.
    // this causes an error, so we mock to avoid it
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }) as Promise<Response>;

    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    mock.reset();
    mockAuth.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    mockAuth.restore();
    global.fetch = unmockedFetch;
    Object.defineProperty(window, 'open', { configurable: true, value: originalOpen });
  });

  it('render component - user not logged in', async () => {
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />);
    });
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(
      `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT}`,
      '_self'
    );
  });

  it('render component - user logged in', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet(`/bff/v1/mandate/delegate/count?status=${DelegationStatus.PENDING}`).reply(200, 3);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    const logo = header?.querySelector('img');
    const organizationId = reduxInitialState.userState.user.organization.id;
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute(
      'src',
      `${getConfiguration().SELFCARE_CDN_URL}/institutions/${organizationId}/logo.png`
    );
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).toBeInTheDocument();
    expect(result!.container).toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(4);
  });

  it('sidemenu not included if error in API call to fetch TOS and privacy', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(500);
    mock.onGet('/bff/downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet(`/bff/v1/mandate/delegate/count?status=${DelegationStatus.PENDING}`).reply(200, 3);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result!.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(4);
  });

  it('sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(false, false));
    mock.onGet('/bff/downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet(`/bff/v1/mandate/delegate/count?status=${DelegationStatus.PENDING}`).reply(200, 3);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    const tosPage = result!.queryByTestId('tos-acceptance-page');
    expect(tosPage).toBeInTheDocument();
    expect(result!.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(4);
  });

  it('sidemenu items if user is admin', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet(`/bff/v1/mandate/delegate/count?status=${DelegationStatus.PENDING}`).reply(200, 3);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to notifications + link to delegated notifications + link to app status + link to delegations +
    // link to contacts + 2 links to selfcare + collapsible menu that contains the first two links
    // + link to Chiavi personali
    expect(sideMenuItems).toHaveLength(9);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).toBeInTheDocument();
  });

  it('sidemenu items if user is a group admin', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(`/bff/v1/mandate/delegate/count?status=${DelegationStatus.PENDING}`).reply(200, 3);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          ...reduxInitialState,
          userState: {
            user: {
              ...userResponse,
              hasGroup: true,
            },
          },
        },
      });
    });
    expect(mock.history.get).toHaveLength(3);
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to delegated notifications + link to app status + link to delegations +
    // 2 links to selfcare + link to Chiavi personali
    expect(sideMenuItems).toHaveLength(6);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).not.toBeInTheDocument();
  });

  it('sidemenu items if user is an operator', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/downtime/v1/status').reply(200, currentStatusDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          ...reduxInitialState,
          userState: {
            user: {
              ...userResponse,
              organization: {
                ...userResponse.organization,
                roles: [
                  {
                    partyRole: PartyRole.MANAGER,
                    role: PNRole.OPERATOR,
                  },
                ],
              },
            },
          },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to notifications + link to delegated notifications + link to app status +
    // 2 links to selfcare + collapsible menu that contains the first two links + link to Chiavi personali
    expect(sideMenuItems).toHaveLength(7);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).toBeInTheDocument();
  });

  it('sidemenu items if user is a group operator', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/downtime/v1/status').reply(200, currentStatusDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          ...reduxInitialState,
          userState: {
            user: {
              ...userResponse,
              organization: {
                ...userResponse.organization,
                roles: [
                  {
                    partyRole: PartyRole.MANAGER,
                    role: PNRole.OPERATOR,
                  },
                ],
              },
              hasGroup: true,
            },
          },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to delegated notifications + link to app status +
    // 2 links to selfcare  + link to Chiavi personali
    expect(sideMenuItems).toHaveLength(5);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).not.toBeInTheDocument();
  });

  it('render component - user logs out', async () => {
    mockAuth.onPost('/logout').reply(200);

    const clearSpy = vi.spyOn(Storage.prototype, 'clear');

    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });

    const header = result.container.querySelector('header');
    expect(header).toBeInTheDocument();

    const button = getByText(header!, 'Esci');
    fireEvent.click(button);

    const modalConfirmButton = await waitFor(() => screen.queryByTestId('confirm-button'));
    fireEvent.click(modalConfirmButton!);

    await waitFor(() => {
      expect(mockOpenFn).toHaveBeenCalledTimes(1);
      const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT}`;
      expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
      expect(clearSpy).toHaveBeenCalled();
      expect(mockAuth.history.post.length).toBe(1);
    });
  });
});
