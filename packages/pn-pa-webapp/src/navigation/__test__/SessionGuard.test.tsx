import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { store } from '../../redux/store';
import SessionGuard from '../SessionGuard';
import * as routes from '../routes.const';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const Guard = () => (
  <Routes>
    <Route path="/" element={<SessionGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('SessionGuard Component', () => {
  const original = window.location;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hash: '' },
    });
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { writable: true, value: original });
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

  // expected behavior: enters the app, doesn't navigate, doesn't launch sessionCheck
  it('no token - anonymous user', async () => {
    await act(async () => {
      render(<Guard />);
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });

  // expected behavior: doesn't enter the app, shows the error message linked to the exchangeToken
  it('exchange token error (403)', async () => {
    window.location.hash = '#selfCareToken=403_token';
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

  // expected behavior: doesn't enter the app, shows the error message linked to the exchangeToken
  it('exchange token error (451)', async () => {
    window.location.hash = '#selfCareToken=451_token';
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
    const logoutComponent = screen.queryByTestId('session-modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith({ pathname: routes.NOT_ACCESSIBLE }, { replace: true });
  });

  // expected behavior: enters the app, does a navigate to notifications page, launches sessionCheck
  it('user logged in - TOS accepted', async () => {
    window.location.hash = '#selfCareToken=200_token';
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

  // expected behavior: enters the app, logout message
  it('logout', async () => {
    window.location.hash = '';
    const mockReduxState = {
      userState: { user: userResponse, isClosedSession: true },
    };
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    const logoutComponent = screen.queryByTestId('session-modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeTruthy();
  });
});
