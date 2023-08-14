import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, mockApi, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient, authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { GET_CONSENTS } from '../../api/consents/consents.routes';
import { ConsentType } from '../../models/consents';
import { store } from '../../redux/store';
import SessionGuard from '../SessionGuard';

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    SessionModal: ({ title }: { title: string }) => (
      <>
        <div>Session Modal</div>
        <div>{title}</div>
      </>
    ),
  };
});

jest.mock('../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../services/configuration.service'),
    getConfiguration: () => ({
      DISABLE_INACTIVITY_HANDLER: true,
    }),
  };
});

describe('SessionGuard Component', () => {
  const original = window.location;
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;
  let mockApi: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    mockApi = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hash: '#selfCareToken=token' },
    });
  });

  afterEach(() => {
    mock.reset();
    mockApi.reset();
  });

  afterAll(() => {
    mock.restore();
    mockApi.restore();
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  // cosa si aspetta: entra nell'app, non fa nessun navigate, lancia il sessionCheck, l'utente viene cancellato da redux
  it('session expired', async () => {
    const mockReduxState = {
      userState: { user: { ...userResponse, desired_exp: 1 } },
    };
    await act(async () => {
      render(<SessionGuard />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    await waitFor(() => {
      expect(store.getState().userState.user.sessionToken).toEqual('');
      const logoutComponent = screen.queryByText('Session Modal');
      expect(logoutComponent).toBeTruthy();
      const logoutTitleComponent = screen.queryByText('leaving-app.title');
      expect(logoutTitleComponent).toBeTruthy();
    });
  });

  // cosa si aspetta: entra nell'app, non fa nessun navigate, non lancia il sessionCheck
  it('no token - anonymous user', async () => {
    await act(async () => {
      render(<SessionGuard />);
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });

  // cosa si aspetta: non entra nell'app, messaggio associato all'errore di exchangeToken
  it('exchange token error (403)', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(403, {
      authorizationToken: 'token',
    });
    await act(async () => {
      render(<SessionGuard />);
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      authorizationToken: 'token',
    });
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
  });

  // cosa si aspetta: non entra nell'app, messaggio associato all'errore di exchangeToken
  it('exchange token error (451)', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(451, {
      authorizationToken: 'token',
    });
    await act(async () => {
      render(<SessionGuard />);
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      authorizationToken: 'token',
    });
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
  });

  // cosa si aspetta: entra nell'app, fa navigate verso notifiche, lancia il sessionCheck
  it('user logged in - TOS accepted', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: 'token' }).reply(200, userResponse);
    mockApi.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mockApi.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: true,
    });
    await act(async () => {
      render(<SessionGuard />);
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(AUTH_TOKEN_EXCHANGE());
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        authorizationToken: 'token',
      });
      expect(mockApi.history.get).toHaveLength(2);
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });

  // cosa si aspetta: non entra nell'app, messaggio di logout
  it('logout', async () => {
    const mockReduxState = {
      userState: { user: userResponse, isClosedSession: true },
    };
    await act(async () => {
      render(<SessionGuard />, { preloadedState: mockReduxState });
    });
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeTruthy();
  });
});
