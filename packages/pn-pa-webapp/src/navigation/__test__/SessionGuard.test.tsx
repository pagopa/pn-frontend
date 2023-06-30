import React from 'react';
import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { render, act, screen, mockApi } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { userResponse } from '../../redux/auth/__test__/test-utils';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import SessionGuard from '../SessionGuard';

const SessionGuardWithErrorPublisher = () => (
  <>
    <ResponseEventDispatcher />
    <AppResponseMessage />
    <SessionGuard />
  </>
);

/* eslint-disable functional/no-let */
let mockLocationHash: string; // #selfCareToken=mocked_token

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
    useLocation: () => ({ hash: mockLocationHash }),
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const mockSessionCheckFn = jest.fn(() => {});

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useSessionCheck: () => mockSessionCheckFn,
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
  beforeEach(() => {
    mockLocationHash = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // cosa si aspetta: entra nell'app, non fa nessun navigate, lancia il sessionCheck
  it('reload - session token presente', async () => {
    const mockReduxState = {
      userState: { user: { sessionToken: 'mocked-token' } },
    };
    await act(
      async () =>
        void render(<SessionGuardWithErrorPublisher />, { preloadedState: mockReduxState })
    );
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  // cosa si aspetta: entra nell'app, non fa nessun navigate, non lancia il sessionCheck
  it('senza spid token - ingresso anonimo', async () => {
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });

  // cosa si aspetta: entra nell'app, fa navigate verso notifiche, lancia il sessionCheck
  it('utente riconosciuto - TOS accettate', async () => {
    const mock = mockApi(
      authClient,
      'POST',
      AUTH_TOKEN_EXCHANGE(),
      200,
      { authorizationToken: '200_token' },
      userResponse
    );
    mockLocationHash = '#selfCareToken=200_token';
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockSessionCheckFn).toBeCalledTimes(1);
    mock.reset();
    mock.restore();
  });

  // cosa si aspetta: non entra nell'app, messaggio associato all'errore di exchangeToken
  it('errore nel selfCare token (403)', async () => {
    const mock = mockApi(authClient, 'POST', AUTH_TOKEN_EXCHANGE(), 403, {
      authorizationToken: '403_token',
    });
    mockLocationHash = '#selfCareToken=403_token';
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
    expect(mockSessionCheckFn).toBeCalledTimes(0);
    mock.reset();
    mock.restore();
  });

  // cosa si aspetta: non entra nell'app, messaggio associato all'errore di exchangeToken
  it('errore nel selfCare token (451)', async () => {
    const mock = mockApi(authClient, 'POST', AUTH_TOKEN_EXCHANGE(), 451, {
      authorizationToken: '451_token',
    });
    mockLocationHash = '#selfCareToken=451_token';
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('messages.451-message');
    expect(logoutTitleComponent).toBeNull();
    expect(mockSessionCheckFn).toBeCalledTimes(0);
    mock.reset();
    mock.restore();
  });

  // cosa si aspetta: non entra nell'app, messaggio di logout
  it('logout', async () => {
    const mockReduxState = {
      userState: { user: { sessionToken: 'mocked-token' }, isClosedSession: true },
    };
    await act(
      async () =>
        void render(<SessionGuardWithErrorPublisher />, { preloadedState: mockReduxState })
    );
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeTruthy();
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });
});
