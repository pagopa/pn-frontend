import MockAdapter from 'axios-mock-adapter';
import { sub } from 'date-fns';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { store } from '../../redux/store';
import SessionGuard from '../SessionGuard';
import * as routes from '../routes.const';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const Guard = () => (
  <Routes>
    <Route path="/" element={<SessionGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
      <Route path="/mocked-route" element={<div>Mocked Page</div>} />
    </Route>
  </Routes>
);

describe('SessionGuard Component', async () => {
  const originalLocation = window.location;
  const originalOpen = window.open;
  let mock: MockAdapter;
  const mockOpenFn = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hash: '', pathname: '/', search: '' },
    });
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    mock.reset();
    window.location.hash = '';
    window.location.pathname = '/';
    window.location.search = '';
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { writable: true, value: originalLocation });
    Object.defineProperty(window, 'open', { configurable: true, value: originalOpen });
  });

  // expected behavior: enters the app, does a navigate, launches sessionCheck, the user is deleted from redux
  it('session expired', async () => {
    const mockReduxState = {
      userState: { user: { ...userResponse, exp: 1 } },
    };

    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    await waitFor(() => {
      expect(store.getState().userState.user.sessionToken).toEqual('');
      const logoutComponent = screen.queryByTestId('session-modal');
      expect(logoutComponent).toBeTruthy();
      const logoutTitleComponent = screen.queryByText('leaving-app.title');
      expect(logoutTitleComponent).toBeTruthy();
    });
  });

  // expected behavior: enters the app, doesn't navigate
  it('no spid token - anonymous access', async () => {
    await act(async () => {
      render(<Guard />);
    });
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(`${routes.LOGOUT}`, '_self');
  });

  // expected behavior: doesn't enter the app, shows the error message linked to the exchangeToken
  it('exchange token error (403)', async () => {
    window.location.hash = '#token=403_token';
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(403, {
      authorizationToken: '403_token',
    });
    await act(async () => {
      render(<Guard />);
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      authorizationToken: '403_token',
    });
    const logoutComponent = screen.queryByTestId('session-modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
  });

  // expected behavior: doesn't enter the app, shows the page not_accessible for error 451
  it('exchange token error (451)', async () => {
    window.location.hash = '#token=451_token';
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(451, {
      authorizationToken: '451_token',
    });
    await act(async () => {
      render(<Guard />);
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      authorizationToken: '451_token',
    });
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(
        { pathname: routes.NOT_ACCESSIBLE },
        { replace: true }
      );
    });
  });

  // expected behavior: enters the app, does a navigate to notifications page, without hash "token" but with search params
  it('user logged in - TOS accepted', async () => {
    window.location.hash = '#token=200_token';
    window.location.search = '?greet=hola&foo=bar';
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    await act(async () => {
      render(<Guard />);
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        authorizationToken: '200_token',
      });
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(
      { pathname: routes.NOTIFICHE, search: '?greet=hola&foo=bar', hash: '' },
      { replace: true }
    );
  });

  // expected behavior: enters the app, does a navigate to notifications page, without hash "token"
  it('reload - session token already present - with hash', async () => {
    window.location.hash = '#token=200_token&greet=hola&foo=bar';
    window.location.pathname = '/mocked-route';
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    await act(async () => {
      render(<Guard />);
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        authorizationToken: '200_token',
      });
    });
    const pageComponent = screen.queryByText('Mocked Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(
      { pathname: location.pathname, search: '', hash: '#greet=hola&foo=bar' },
      { replace: true }
    );
  });

  // expected behavior: enters the app, exp token -> logout message
  it('logout', async () => {
    window.location.hash = '';
    window.location.pathname = '/';
    const exp = sub(new Date(), { minutes: 5 }).getTime() / 1000;
    const mockReduxState = {
      userState: { user: { ...userResponse, exp } },
    };
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    await waitFor(() => {
      const logoutComponent = screen.queryByTestId('session-modal');
      expect(logoutComponent).toBeTruthy();
      const logoutTitleComponent = screen.queryByText('leaving-app.title');
      expect(logoutTitleComponent).toBeTruthy();
    });
  });
});
