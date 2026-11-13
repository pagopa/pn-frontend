import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import App from '../App';
import { operatorUserResponse, userResponse } from '../__mocks__/Auth.mock';
import { productsDTO } from '../__mocks__/Products.mock';
import { apiClient, authClient } from '../api/apiClients';
import { AUTH_LOGOUT, AUTH_TOKEN_EXCHANGE } from '../api/auth/auth.routes';
import { DASHBOARD, ENTI, GROUPS, SELFCARE_LOGOUT_PATH, USERS } from '../navigation/routes.const';
import { getConfiguration } from '../services/configuration.service';
import { act, fireEvent, render, screen, waitFor, within } from './test-utils';

const PRODUCTS_URL = '/bff/v1/institutions/products';

const loggedState = (user = userResponse) => ({
  userState: { user, productsOfInstitution: [] },
});

describe('App', () => {
  let mock: MockAdapter;
  let apiMock: MockAdapter;
  const mockOpenFn = vi.fn();
  const productsCalls = () => apiMock.history.get.filter((req) => req.url === PRODUCTS_URL);

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    apiMock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    vi.stubGlobal('open', mockOpenFn);
  });

  afterEach(() => {
    mock.reset();
    apiMock.reset();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    mock.restore();
    apiMock.restore();
  });

  it('renders header, side menu, footer and home page', async () => {
    const { container } = await act(async () => render(<App />, { preloadedState: loggedState() }));
    // header
    expect(container).toHaveTextContent(/PagoPA S.p.A.AssistenzaEsci/i);
    // only the party of the user is shown, without the party switch
    const partyName = userResponse.organization.name;
    expect(container).toHaveTextContent(partyName);
    expect(screen.getByText('roles.admin')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: new RegExp(partyName) })).not.toBeInTheDocument();
    // side menu
    const sideMenu = screen.getByTestId('sideMenu');
    expect(within(sideMenu).getByText('menu.institutions')).toBeInTheDocument();
    expect(within(sideMenu).getByText('menu.users')).toBeInTheDocument();
    expect(within(sideMenu).getByText('menu.groups')).toBeInTheDocument();
    // footer
    expect(container).toHaveTextContent(/PagoPA S.p.A. — società per azioni/i);
    // page content
    expect(screen.getByTestId('institutionsPage')).toBeInTheDocument();
  });

  it('opens SelfCare users and groups pages from the side menu', async () => {
    await act(async () => render(<App />, { preloadedState: loggedState() }));
    const { id } = userResponse.organization;
    fireEvent.click(screen.getByTestId('sideMenuItem-menu.users'));
    expect(mockOpenFn).toHaveBeenCalledWith(USERS(id, 'it'));
    fireEvent.click(screen.getByTestId('sideMenuItem-menu.groups'));
    expect(mockOpenFn).toHaveBeenCalledWith(GROUPS(id, 'it'));
  });

  it('hides SelfCare items to operator users', async () => {
    await act(async () => render(<App />, { preloadedState: loggedState(operatorUserResponse) }));
    const sideMenu = screen.getByTestId('sideMenu');
    expect(within(sideMenu).getByText('menu.institutions')).toBeInTheDocument();
    expect(within(sideMenu).queryByText('menu.users')).not.toBeInTheDocument();
    expect(within(sideMenu).queryByText('menu.groups')).not.toBeInTheDocument();
  });

  it('hides side menu to anonymous users', async () => {
    await act(async () => render(<App />));
    expect(screen.queryByTestId('sideMenu')).not.toBeInTheDocument();
  });

  it('performs logout', async () => {
    mock.onPost(AUTH_LOGOUT()).reply(200);
    const { testStore } = await act(async () => render(<App />, { preloadedState: loggedState() }));
    fireEvent.click(screen.getByRole('button', { name: 'Esci' }));
    const confirmButton = await screen.findByTestId('confirm-button');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(AUTH_LOGOUT());
      expect(testStore.getState().userState.user.sessionToken).toBe('');
      expect(mockOpenFn).toHaveBeenCalledWith(
        `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`,
        '_self'
      );
    });
  });

  it('performs logout even if the logout api fails', async () => {
    mock.onPost(AUTH_LOGOUT()).reply(500);
    const { testStore } = await act(async () => render(<App />, { preloadedState: loggedState() }));
    fireEvent.click(screen.getByRole('button', { name: 'Esci' }));
    const confirmButton = await screen.findByTestId('confirm-button');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(testStore.getState().userState.user.sessionToken).toBe('');
      expect(mockOpenFn).toHaveBeenCalledWith(
        `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`,
        '_self'
      );
    });
  });

  it('does not logout if the user cancels', async () => {
    const { testStore } = await act(async () => render(<App />, { preloadedState: loggedState() }));
    fireEvent.click(screen.getByRole('button', { name: 'Esci' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'button.annulla' }));
    await waitFor(() => {
      expect(screen.queryByTestId('confirm-button')).not.toBeInTheDocument();
    });
    expect(mock.history.post).toHaveLength(0);
    expect(testStore.getState().userState.user.sessionToken).toBe(userResponse.sessionToken);
    expect(mockOpenFn).not.toHaveBeenCalled();
  });

  it('renders the not found page for an unknown route and goes back to home', async () => {
    const { router } = await act(async () =>
      render(<App />, { route: '/unknown-route', preloadedState: loggedState() })
    );
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.queryByTestId('institutionsPage')).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId('not-found-back-button'));
    });
    expect(router.state.location.pathname).toBe(ENTI);
    expect(screen.getByTestId('institutionsPage')).toBeInTheDocument();
  });

  it('removes the selfCareToken from the url after the token exchange', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    const { router } = await act(async () =>
      render(<App />, { route: '/#selfCareToken=200_token' })
    );
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(router.state.location.pathname).toBe(ENTI);
      expect(router.state.location.hash).toBe('');
    });
    expect(screen.getByTestId('institutionsPage')).toBeInTheDocument();
  });

  it('opens SelfCare reserved area from the products switch', async () => {
    const assignFn = vi.fn();
    vi.stubGlobal('location', { href: '', assign: assignFn });
    const { container } = await act(async () => render(<App />, { preloadedState: loggedState() }));
    const headers = container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.getByRole('presentation'));
    fireEvent.click(within(productDropdown).getByText('header.reserved-area'));
    expect(assignFn).toHaveBeenCalledWith(DASHBOARD(userResponse.organization.id, 'it'));
  });

  it('shows the products of the institution in the products switch', async () => {
    apiMock.onGet(PRODUCTS_URL).reply(200, productsDTO);
    const assignFn = vi.fn();
    vi.stubGlobal('location', { href: '', assign: assignFn });
    const { container, testStore } = await act(async () =>
      render(<App />, { preloadedState: loggedState() })
    );
    await waitFor(() => {
      expect(productsCalls()).toHaveLength(1);
      expect(testStore.getState().userState.productsOfInstitution).toStrictEqual(productsDTO);
    });
    const headers = container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    await waitFor(() => expect(productButton).toHaveTextContent(productsDTO[0].title));
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.getByRole('presentation'));
    expect(within(productDropdown).getByText('header.reserved-area')).toBeInTheDocument();
    expect(within(productDropdown).queryByText('header.notification-platform')).not.toBeInTheDocument();
    fireEvent.click(within(productDropdown).getByText(productsDTO[1].title));
    expect(assignFn).toHaveBeenCalledWith(`${productsDTO[1].productUrl}&lang=it`);
  });

  it('shows the current product if the products api fails', async () => {
    apiMock.onGet(PRODUCTS_URL).reply(500);
    const { container, testStore } = await act(async () =>
      render(<App />, { preloadedState: loggedState() })
    );
    await waitFor(() => {
      expect(productsCalls()).toHaveLength(1);
    });
    expect(testStore.getState().userState.productsOfInstitution).toStrictEqual([]);
    const headers = container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    expect(productButton).toHaveTextContent('header.notification-platform');
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.getByRole('presentation'));
    expect(within(productDropdown).getByText('header.reserved-area')).toBeInTheDocument();
    expect(within(productDropdown).getByText('header.notification-platform')).toBeInTheDocument();
  });

  it('does not call the products api for anonymous users', async () => {
    await act(async () => render(<App />));
    expect(productsCalls()).toHaveLength(0);
  });
});
