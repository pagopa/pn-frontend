import MockAdapter from 'axios-mock-adapter';
import { Suspense } from 'react';
import { vi } from 'vitest';

import { ThemeProvider } from '@mui/material';
import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { tosPrivacyConsentMock } from '../__mocks__/Consents.mock';
import { digitalAddresses } from '../__mocks__/Contacts.mock';
import { mandatesByDelegate } from '../__mocks__/Delegations.mock';
import { notificationsDTO } from '../__mocks__/Notifications.mock';
import { apiClient, authClient } from '../api/apiClients';
import { LoginProvider } from '../models/User';
import { LOGOUT, LOGOUT_OI } from '../navigation/routes.const';
import { RenderResult, act, fireEvent, render, screen, waitFor, within } from './test-utils';

vi.mock('../pages/Notifiche.page', () => ({ default: () => <div>Generic Page</div> }));
vi.mock('../pages/Profile.page', () => ({ default: () => <div>Profile Page</div> }));

const unmockedFetch = globalThis.fetch;

const Component = () => (
  <ThemeProvider theme={theme}>
    <Suspense fallback="loading...">
      <App />
    </Suspense>
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
    tosPrivacyApiError: false,
    loginProvider: LoginProvider.SPIDHUB,
  },
};

describe('App', async () => {
  let mock: MockAdapter;
  let mockAuth: MockAdapter;
  let result: RenderResult;
  const mockOpenFn = vi.fn();
  const originalOpen = globalThis.open;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    mockAuth = new MockAdapter(authClient);
    // FooterPreLogin (mui-italia) component calls an api to fetch selfcare products list.
    // this causes an error, so we mock to avoid it
    globalThis.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }) as Promise<Response>;
    Object.defineProperty(globalThis, 'open', {
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
    globalThis.fetch = unmockedFetch;
    Object.defineProperty(globalThis, 'open', { configurable: true, value: originalOpen });
  });

  it('render component - user not logged in', async () => {
    await act(async () => {
      result = render(<Component />);
    });
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(`${LOGOUT}`, '_self');
  });

  it('render component - user logged in', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).toBeInTheDocument();
    expect(result.container).toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('check header actions - user logged in', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    mockAuth.onPost('/logout').reply(200);

    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = document.querySelector('header');
    const userButton = header?.querySelector(
      `[aria-label="Area utente ${userResponse.name} ${userResponse.family_name}"]`
    );
    fireEvent.click(userButton!);
    let menu = await waitFor(() => screen.getByRole('presentation'));
    let menuItems = within(menu).getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent('menu.profilo');
    expect(menuItems[1]).toHaveTextContent('header.logout');
    fireEvent.click(menuItems[0]);
    await waitFor(() => {
      expect(result.container).toHaveTextContent('Profile Page');
    });

    fireEvent.click(userButton!);
    menu = await waitFor(() => screen.getByRole('presentation'));
    menuItems = within(menu).getAllByRole('menuitem');
    fireEvent.click(menuItems[1]);

    const logoutDialog = await waitFor(() => screen.getByTestId('dialog'));
    expect(logoutDialog).toBeInTheDocument();
    const confirmLogoutButton = within(logoutDialog).getByTestId('confirm-button');
    fireEvent.click(confirmLogoutButton);

    await waitFor(() => {
      expect(sessionStorage.getItem('user')).toBeNull();
      expect(mockOpenFn).toHaveBeenCalledTimes(1);
      expect(mockOpenFn).toHaveBeenCalledWith(`${LOGOUT}`, '_self');
      expect(mockAuth.history.post.length).toBe(1);
    });
  });

  it('redirect to One Identity login portal on logout', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    mockAuth.onPost('/logout').reply(200);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          ...reduxInitialState,
          userState: {
            ...reduxInitialState.userState,
            loginProvider: LoginProvider.ONEIDENTITY,
          },
        },
      });
    });

    const header = document.querySelector('header');
    const userButton = header?.querySelector(
      `[aria-label="Area utente ${userResponse.name} ${userResponse.family_name}"]`
    );
    fireEvent.click(userButton!);

    let menu = await waitFor(() => screen.getByRole('presentation'));
    let menuItems = within(menu).getAllByRole('menuitem');
    fireEvent.click(menuItems[0]);

    await waitFor(() => {
      expect(result.container).toHaveTextContent('Profile Page');
    });

    fireEvent.click(userButton!);
    menu = await waitFor(() => screen.getByRole('presentation'));
    menuItems = within(menu).getAllByRole('menuitem');
    fireEvent.click(menuItems[1]);

    const logoutDialog = await waitFor(() => screen.getByTestId('dialog'));
    expect(logoutDialog).toBeInTheDocument();
    const confirmLogoutButton = within(logoutDialog).getByTestId('confirm-button');
    fireEvent.click(confirmLogoutButton);

    await waitFor(() => {
      expect(sessionStorage.getItem('user')).toBeNull();
      expect(mockOpenFn).toHaveBeenCalledTimes(1);
      expect(mockOpenFn).toHaveBeenCalledWith(`${LOGOUT_OI}`, '_self');
      expect(mockAuth.history.post.length).toBe(1);
    });
  });

  it('sidemenu not included if error in API call to fetch TOS and Privacy', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(500);
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(false, false));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    const tosPage = result.queryByTestId('tos-acceptance-page');
    expect(tosPage).toBeInTheDocument();
    expect(result.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('check header actions - user has not accepted the TOS and PRIVACY', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(false, false));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    await act(async () => {
      render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = document.querySelector('header');
    const userButton = header?.querySelector(
      `[aria-label="Area utente ${userResponse.name} ${userResponse.family_name}"]`
    );
    fireEvent.click(userButton!);
    const menu = await waitFor(() => screen.getByRole('presentation'));
    const menuItems = within(menu).getAllByRole('menuitem');
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0]).toHaveTextContent('header.logout');
  });

  it('sidemenu items if there are delegators', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    expect(sideMenuItems).toHaveLength(7);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).toBeInTheDocument();
  });

  it('sidemenu items if there are no delegators', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, []);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    expect(sideMenuItems).toHaveLength(4);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).not.toBeInTheDocument();
  });
});
