import MockAdapter from 'axios-mock-adapter';
import { sub } from 'date-fns';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE, ONE_IDENTITY_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { store } from '../../redux/store';
import { AAR_UTM, UTM_KEY } from '../../utility/utm.utility';
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
  const originalOpen = globalThis.open;
  let mock: MockAdapter;
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
    globalThis.history.replaceState({}, '', '/');
    globalThis.location.hash = '';
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
    globalThis.location.hash = '#token=403_token';
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
    globalThis.location.hash = '#token=451_token';
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

  it('token-exchange user validation failed', async () => {
    globalThis.location.hash = '#token=validation_error_token';

    const invalidUserResponse = {
      ...userResponse,
      level: '@L2',
    };

    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, invalidUserResponse);

    await act(async () => {
      render(<Guard />);
    });

    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      authorizationToken: 'validation_error_token',
    });

    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(
        {
          pathname: routes.NOT_ACCESSIBLE,
          search: '?reason=user-validation-failed',
        },
        { replace: true }
      );
    });
  });

  // expected behavior: enters the app
  it('user logged in - TOS accepted', async () => {
    globalThis.history.replaceState({}, '', `/?greet=hola&foo=bar#token=200_token`);
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
  });

  // expected behavior: enters the app with session token already present
  it('reload - session token already present', async () => {
    globalThis.history.replaceState({}, '', '/mocked-route');
    const mockReduxState = {
      userState: { user: userResponse },
    };
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    await waitFor(() => {
      const pageComponent = screen.queryByText('Mocked Page');
      expect(pageComponent).toBeTruthy();
    });
  });

  // expected behavior: enters the app, exp token -> logout message, redirects to LOGOUT (not OI)
  it('logout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    globalThis.history.replaceState({}, '', '/');
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

    expect(mockOpenFn).toHaveBeenCalledWith(`${routes.LOGOUT}`, '_self');

    vi.useRealTimers();
  });

  it('One Identity Exchange Token - successful exchange token', async () => {
    globalThis.location.hash =
      '#code=valid_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri';
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, userResponse);
    await act(async () => {
      render(<Guard />);
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
    globalThis.location.hash =
      '#code=403_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri';
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(403, {
      code: '403_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });
    await act(async () => {
      render(<Guard />);
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
    globalThis.location.hash =
      '#code=451_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri';
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(451, {
      code: '451_code',
      state: 'some_state',
      nonce: 'some_nonce',
      redirect_uri: 'some_uri',
    });
    await act(async () => {
      render(<Guard />);
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
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(
        { pathname: routes.NOT_ACCESSIBLE },
        { replace: true }
      );
    });
  });

  it('One Identity Exchange Token - user validation failed', async () => {
    globalThis.location.hash =
      '#code=some_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri';

    const invalidUserResponse = {
      ...userResponse,
      level: '@L2',
    };

    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, invalidUserResponse);

    await act(async () => {
      render(<Guard />);
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
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(
        {
          pathname: routes.NOT_ACCESSIBLE,
          search: '?reason=user-validation-failed',
        },
        { replace: true }
      );
    });
  });

  it("One Identity Exchange Token - missing params in url doesn't call the api", async () => {
    globalThis.location.hash = '#code=some_code&state=some_state';

    await act(async () => {
      render(<Guard />);
    });

    expect(mock.history.post).toHaveLength(0);
  });

  it('One Identity Exchange Token - successful exchange token with rapid access', async () => {
    const search = '?aar=mocked-qr-code';
    const hash = '#code=valid_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri';
    globalThis.history.replaceState({}, '', `/${search}${hash}`);
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, userResponse);

    await act(async () => {
      render(<Guard />);
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

    globalThis.location.hash =
      '#code=valid_code&state=some_state&nonce=some_nonce&redirect_uri=some_uri';
    const exp = sub(new Date(), { minutes: 5 }).getTime() / 1000;
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, { ...userResponse, exp });

    await act(async () => {
      render(<Guard />);
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

  it('should preserve aar param and inject UTMs when redirecting a non-logged user to login', async () => {
    globalThis.history.replaceState({}, '', `/?${AppRouteParams.AAR}=mocked-qr-code`);

    await act(async () => {
      render(<Guard />);
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl, target] = mockOpenFn.mock.calls[0];
    expect(target).toBe('_self');

    const parsed = new URL(redirectUrl, 'https://test.pagopa.it');

    expect(parsed.pathname).toBe('/auth/logout');
    expect(parsed.searchParams.get(AppRouteParams.AAR)).toBe('mocked-qr-code');
    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe(AAR_UTM[UTM_KEY.CAMPAIGN]);
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe(AAR_UTM[UTM_KEY.SOURCE]);
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe(AAR_UTM[UTM_KEY.MEDIUM]);
  });
});
