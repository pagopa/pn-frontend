import React from 'react';

import { act, screen } from '@testing-library/react';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import * as routes from '../routes.const';
import SessionGuard from '../SessionGuard';

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


jest.mock('../../api/auth/Auth.api', () => {
  const original = jest.requireActual('../../api/auth/Auth.api');
  return {
    ...original,
    AuthApi: {
      exchangeToken: (spidToken: string) => {
        if (spidToken.startsWith('403')) {
          return Promise.reject({ response: { status: 403 } });
        } else if (spidToken.startsWith('451')) {
          return Promise.reject({ response: { status: 451 } });
        }
        return Promise.resolve({ sessionToken: 'good-session-token' });
      },
    },
  };
});

describe('SessionGuard Component', () => {
  beforeEach(() => {
    mockLocationHash = '';
    mockLocationSearch = '';
  });

  afterEach(() => {
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
    mockLocationHash = '#selfCareToken=200_token';
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
    mockLocationHash = '#selfCareToken=200_token';
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
    mockLocationHash = '#selfCareToken=200_token&#greet=hola';
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
    mockLocationHash = '#selfCareToken=403_token';
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
    mockLocationHash = '#selfCareToken=451_token';
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
