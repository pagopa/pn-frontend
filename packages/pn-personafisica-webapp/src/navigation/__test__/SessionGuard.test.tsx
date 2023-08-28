import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { store } from '../../redux/store';
import SessionGuard from '../SessionGuard';

jest.mock('react-i18next', () => ({
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
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { writable: true, value: original });
  });

  // expected behavior: enters the app, does a navigate, launches sessionCheck
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

  it('no spid token - anonymous access', async () => {
    await act(async () => {
      render(<Guard />);
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });

  it('reload - session token already present - with hash', async () => {
    window.location.hash = '#greet=hola';
    const mockReduxState = {
      userState: { user: { ...userResponse, desired_exp: 1 } },
    };
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });

  // cosa si aspetta: non entra nell'app, messaggio associato all'errore di exchangeToken
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

  // cosa si aspetta: non entra nell'app, messaggio associato all'errore di exchangeToken
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

    const logoutComponent = screen.queryByTestId('session-modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
  });

  // cosa si aspetta: entra nell'app, fa navigate verso notifiche, lancia il sessionCheck
  it('user logged in - TOS accepted', async () => {
    window.location.hash = '#token=200_token';
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

  // cosa si aspetta: non entra nell'app, messaggio di logout
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
