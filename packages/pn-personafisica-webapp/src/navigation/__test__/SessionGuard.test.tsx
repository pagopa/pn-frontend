import MockAdapter from 'axios-mock-adapter';
import { sub } from 'date-fns';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { RenderResult, act, render, screen, waitFor } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE, ONE_IDENTITY_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { store } from '../../redux/store';
import SessionGuard from '../SessionGuard';
import * as routes from '../routes.const';

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
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(403, {
      authorizationToken: '403_token',
    });
    await act(async () => {
      render(<Guard />, { route: '/#token=403_token' });
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
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(451, {
      authorizationToken: '451_token',
    });
    await act(async () => {
      result = render(<Guard />, { route: '/#token=451_token' });
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
      fiscal_number: '@RSSGPP80B02G273H',
    };

    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, invalidUserResponse);

    await act(async () => {
      result = render(<Guard />, { route: '/#token=validation_error_token' });
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

  // expected behavior: enters the app
  it('user logged in - TOS accepted', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    await act(async () => {
      render(<Guard />, { route: '/?greet=hola&foo=bar#token=200_token' });
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

  // expected behavior: enters the app with session token already present
  it('reload - session token already present', async () => {
    const mockReduxState = {
      userState: { user: userResponse },
    };
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState, route: ['/', '/mocked-route'] });
    });
    await waitFor(() => {
      const pageComponent = screen.queryByText('Mocked Page');
      expect(pageComponent).toBeTruthy();
    });
  });

  // expected behavior: enters the app, exp token -> logout message, redirects to LOGOUT (not OI)
  it('logout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

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

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
      expect(mock.history.post).toHaveLength(0);
    });
    expect(mockOpenFn).toHaveBeenCalledWith(routes.LOGOUT, '_self');
    vi.useRealTimers();
  });

  it('One Identity Exchange Token - successful exchange token', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, userResponse);
    await act(async () => {
      render(<Guard />, {
        route: '/#code=valid_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri',
      });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(ONE_IDENTITY_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      code: 'valid_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });
  });

  it('One Identity Exchange Token - error (403)', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(403, {
      code: '403_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });
    await act(async () => {
      render(<Guard />, {
        route: '/#code=403_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri',
      });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(ONE_IDENTITY_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      code: '403_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });
    const logoutComponent = screen.queryByTestId('session-modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
  });

  it('One Identity Exchange Token - error (451)', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(451, {
      code: '451_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });
    await act(async () => {
      result = render(<Guard />, {
        route: '/#code=451_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri',
      });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(ONE_IDENTITY_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      code: '451_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOT_ACCESSIBLE);
      expect(result.router.state.historyAction).toBe('REPLACE');
    });
  });

  it('One Identity Exchange Token - user validation failed', async () => {
    const invalidUserResponse = {
      ...userResponse,
      fiscal_number: '@RSSGPP80B02G273H',
    };

    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, invalidUserResponse);

    await act(async () => {
      result = render(<Guard />, {
        route: '/#code=some_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri',
      });
    });

    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(ONE_IDENTITY_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      code: 'some_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOT_ACCESSIBLE);
      expect(result.router.state.location.search).toBe('?reason=user-validation-failed');
      expect(result.router.state.historyAction).toBe('REPLACE');
    });
  });

  it("One Identity Exchange Token - missing params in url doesn't call the api", async () => {
    await act(async () => {
      render(<Guard />, { route: '/#code=some_code&state=some_state' });
    });

    expect(mock.history.post).toHaveLength(0);
  });

  it('One Identity Exchange Token - successful exchange token with rapid access', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, userResponse);

    await act(async () => {
      render(<Guard />, {
        route:
          '/?aar=mocked-qr-code#code=valid_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri',
      });
    });

    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(ONE_IDENTITY_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      code: 'valid_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
      source: {
        type: 'QR',
        id: 'mocked-qr-code',
      },
    });
  });

  it('One Identity Exchange Token - logout redirects to LOGOUT_OI', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const exp = sub(new Date(), { minutes: 5 }).getTime() / 1000;
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, { ...userResponse, exp });

    await act(async () => {
      render(<Guard />, {
        route: '/#code=valid_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri',
      });
    });

    await waitFor(() => {
      const logoutComponent = screen.queryByTestId('session-modal');
      expect(logoutComponent).toBeTruthy();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    expect(mockOpenFn).toHaveBeenCalledWith(routes.LOGOUT_OI, '_self');
    vi.useRealTimers();
  });
});
