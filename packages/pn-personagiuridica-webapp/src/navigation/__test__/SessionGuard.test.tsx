import MockAdapter from 'axios-mock-adapter';
import { sub } from 'date-fns';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { RenderResult, act, render, screen, waitFor } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { store } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';
import SessionGuard from '../SessionGuard';
import * as routes from '../routes.const';
import { DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM } from '../routes.const';

const Guard = () => (
  <Routes>
    <Route element={<SessionGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
      <Route path="/mocked-route" element={<div>Mocked Page</div>} />
    </Route>
  </Routes>
);

describe('SessionGuard Component', async () => {
  let mock: MockAdapter;
  let result: RenderResult;

  const originalOpen = globalThis.open;
  const mockOpenFn = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    Object.defineProperty(globalThis, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(globalThis, 'open', { configurable: true, value: originalOpen });
  });

  // expected behavior: enters the app, does a navigate, launches sessionCheck, the user is deleted from redux
  it('session expired', async () => {
    const mockReduxState = {
      userState: { user: { ...userResponse, desired_exp: 1 } },
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

  // expected behavior: enters the app, does no navigate, doesn't launch sessionCheck
  it('no spid token - anonymous access', async () => {
    await act(async () => {
      render(<Guard />);
    });
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(
      `${getConfiguration().SELFCARE_BASE_URL}${routes.SELFCARE_LOGOUT}`,
      '_self'
    );
  });

  // expected behavior: doesn't enter the app, shows the error message linked to the exchangeToken
  it('exchange token error (403)', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(403, {
      authorizationToken: '403_token',
    });
    await act(async () => {
      render(<Guard />, { route: '/#selfCareToken=403_token' });
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

  // expected behavior: doesn't enter the app, shows the error message linked to the exchangeToken
  it('exchange token error (451)', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(451, {
      authorizationToken: '451_token',
    });
    await act(async () => {
      result = render(<Guard />, { route: '/#selfCareToken=451_token' });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      authorizationToken: '451_token',
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOT_ACCESSIBLE);
      expect(result.router.state.historyAction).toBe('REPLACE');
    });
  });

  it('token-exchange user validation failed', async () => {
    const invalidUserResponse = {
      ...userResponse,
      level: '@L2',
    };

    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, invalidUserResponse);

    await act(async () => {
      result = render(<Guard />, { route: '/#selfCareToken=validation_error_token' });
    });

    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      authorizationToken: 'validation_error_token',
    });

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOT_ACCESSIBLE);
      expect(result.router.state.location.search).toBe('?reason=user-validation-failed');
      expect(result.router.state.historyAction).toBe('REPLACE');
    });
  });

  // expected behavior: enters the app, does a navigate to notifications page, launches sessionCheck
  it('user logged in - TOS accepted', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    await act(async () => {
      render(<Guard />, { route: '/#selfCareToken=200_token' });
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
  });

  // expected behavior: enters the app, does a navigate to notifications page, launches sessionCheck
  it('user with groups logged in - TOS accepted', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' }).reply(200, {
      ...userResponse,
      organization: { ...userResponse.organization, groups: ['mocked-group'] },
    });
    await act(async () => {
      render(<Guard />, { route: '/#selfCareToken=200_token' });
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
  });

  // expected behavior: enters the app, does a navigate to notifications page, launches sessionCheck
  it('reload - session token already present - with hash', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    await act(async () => {
      render(<Guard />, { route: '/mocked-route#selfCareToken=200_token&greet=hola' });
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
  });

  it('store aar in localStorage', async () => {
    const mockQrCode = 'qr-code';
    await act(async () => {
      render(<Guard />, { route: `/?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}` });
    });
    expect(localStorage.getItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM)).toBe(mockQrCode);
  });

  // expected behavior: does not enter the app, does no navigate, message about logout
  it('logout', async () => {
    const desired_exp = sub(new Date(), { minutes: 5 }).getTime() / 1000;

    const mockReduxState = {
      userState: { user: { ...userResponse, desired_exp } },
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

    // No call api logout because the token is expired
    vi.useFakeTimers();
    await act(async () => {
      vi.advanceTimersByTime(3000);
      expect(mock.history.post).toHaveLength(0);
    });
    vi.useRealTimers();
  });
});
