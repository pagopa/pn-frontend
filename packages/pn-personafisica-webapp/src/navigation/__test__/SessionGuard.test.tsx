import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import SessionGuard from '../SessionGuard';
import * as routes from '../routes.const';

const SessionGuardWithErrorPublisher = () => (
  <>
    <ResponseEventDispatcher />
    <AppResponseMessage />
    <SessionGuard />
  </>
);

const mockNavigateFn = jest.fn(() => {});

/* eslint-disable functional/no-let */
let mockLocationHash: string; // #token=mocked_token
let mockLocationPath: string; // e.g. "/" or routes.NOTIFICHE
let mockLocationSearch: string;

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
    useNavigate: () => mockNavigateFn,
    useLocation: () => ({
      hash: mockLocationHash,
      search: mockLocationSearch,
      pathname: mockLocationPath,
    }),
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

describe('SessionGuard Component', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mockLocationHash = '';
    mockLocationSearch = '';
  });

  beforeAll(() => {
    mock = new MockAdapter(authClient);
  });

  afterAll(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // expected behavior: enters the app, does a navigate, launches sessionCheck
  it('reload - session token already present', async () => {
    mockLocationSearch = `?${routes.DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=toto`;
    const mockReduxState = {
      userState: { user: { sessionToken: 'mocked-token' } },
    };
    await act(
      async () =>
        void render(<SessionGuardWithErrorPublisher />, { preloadedState: mockReduxState })
    );
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      { pathname: undefined, search: mockLocationSearch, hash: '' },
      { replace: true }
    );
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  it('reload - session token already present - with hash', async () => {
    mockLocationPath = routes.DELEGHE;
    mockLocationHash = '#greet=hola';
    const mockReduxState = {
      userState: { user: { sessionToken: 'mocked-token' } },
    };
    await act(
      async () =>
        void render(<SessionGuardWithErrorPublisher />, { preloadedState: mockReduxState })
    );
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      { pathname: routes.DELEGHE, search: '', hash: mockLocationHash },
      { replace: true }
    );
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  // expected behavior: enters the app, does no navigate, doesn't launch sessionCheck
  it('no spid token - anonymous access', async () => {
    mockLocationPath = routes.TERMS_OF_SERVICE;
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });

  it('sound login - no path indicated', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    mockLocationHash = '#token=200_token';
    mockLocationPath = '/';
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      { pathname: routes.NOTIFICHE, search: '' },
      { replace: true }
    );
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  it('sound login - path indicated', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    mockLocationHash = '#token=200_token';
    mockLocationPath = routes.DELEGHE;
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      { pathname: routes.DELEGHE, search: '', hash: '' },
      { replace: true }
    );
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  it('sound login - path indicated - with additional hash value', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    mockLocationHash = '#token=200_token&#greet=hola';
    mockLocationPath = routes.DELEGHE;
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      { pathname: routes.DELEGHE, search: '', hash: '#greet=hola' },
      { replace: true }
    );
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  // expected behavior: does not enter the app, does no navigate, message about exchangeToken error
  // (i.e. different than the logout message)
  it('bad SPID token (403)', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), {
        authorizationToken: '403_token',
      })
      .reply(403);
    mockLocationHash = '#token=403_token';
    mockLocationPath = '/';
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('leaving-app.title');
    expect(logoutTitleComponent).toBeNull();
    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });

  // expected behavior: does not enter the app, does no navigate, message about exchangeToken error
  // (i.e. different than the logout message)
  it('bad SPID token (451)', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), {
        authorizationToken: '451_token',
      })
      .reply(451);
    mockLocationHash = '#token=451_token';
    mockLocationPath = '/';
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText('messages.451-message');
    expect(logoutTitleComponent).toBeNull();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });

  // expected behavior: does not enter the app, does no navigate, message about logout
  it('logout', async () => {
    mockLocationPath = routes.NOTIFICHE;
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
    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });
});
