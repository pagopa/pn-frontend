import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import App from '../App';
import { operatorUserResponse, userResponse } from '../__mocks__/Auth.mock';
import { authClient } from '../api/apiClients';
import { AUTH_LOGOUT } from '../api/auth/auth.routes';
import { DASHBOARD, GROUPS, HOME, SELFCARE_LOGOUT_PATH, USERS } from '../navigation/routes.const';
import { getConfiguration } from '../services/configuration.service';
import { act, fireEvent, render, screen, waitFor, within } from './test-utils';

const loggedState = (user = userResponse) => ({ userState: { user } });

describe('App', () => {
  let mock: MockAdapter;
  const mockOpenFn = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(authClient);
  });

  beforeEach(() => {
    vi.stubGlobal('open', mockOpenFn);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    mock.restore();
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
    fireEvent.click(await screen.findByRole('button', { name: 'button.annulla' }));
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
    expect(router.state.location.pathname).toBe(HOME);
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
});
