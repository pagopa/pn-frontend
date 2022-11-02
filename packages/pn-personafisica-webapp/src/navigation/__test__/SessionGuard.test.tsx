import { act, screen } from '@testing-library/react';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import SessionGuard from '../SessionGuard';
import * as routes from '../routes.const';

const SessionGuardWithErrorPublisher = () => (
  <>
    <ResponseEventDispatcher />
    <AppResponseMessage />
    <SessionGuard />
  </>
);

const mockNavigateFn = jest.fn(() => { });

/* eslint-disable functional/no-let */
let mockLocationHash: string;  // #token=mocked_token

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
    useNavigate: () => mockNavigateFn,
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

const mockSessionCheckFn = jest.fn(() => { });

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useSessionCheck: () => mockSessionCheckFn,
    SessionModal: ({ title }: { title: string }) => <>
      <div>Session Modal</div>
      <div>{title}</div>
    </>,
  };
});

jest.mock('../../utils/constants', () => {
  const original = jest.requireActual('../../utils/constants');
  return {
    ...original,
    DISABLE_INACTIVITY_HANDLER: true,
  };
});

/* eslint-disable functional/no-let */
let mockTosValue: boolean;
let mockMakeTosCallFail: boolean;

jest.mock('../../api/consents/Consents.api', () => {
  const original = jest.requireActual('../../api/consents/Consents.api');
  return {
    ...original,
    ConsentsApi: {
      getConsentByType: () => mockMakeTosCallFail
        ? Promise.reject({ response: { status: 500 } })
        : Promise.resolve({
            recipientId: "mock-consent-id",
            consentType: "TOS",
            accepted: mockTosValue,
          })
    },
  };
});

jest.mock('../../api/auth/Auth.api', () => {
  const original = jest.requireActual('../../api/auth/Auth.api');
  return {
    ...original,
    AuthApi: {
      exchangeToken: (spidToken: string) => spidToken.startsWith("good")
        ? Promise.resolve({ sessionToken: "good-session-token" })
        : Promise.reject({ response: { status: 403 } })
    }
  };
});


describe('SessionGuard Component', () => {
  beforeEach(() => {
    mockTosValue = true;
    mockMakeTosCallFail = false;
    mockLocationHash = "";
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

    await act(async () => void render(<SessionGuardWithErrorPublisher />, { preloadedState: mockReduxState }));
    const pageComponent = screen.queryByText("Generic Page");
    expect(pageComponent).toBeTruthy();

    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  // cosa si aspetta: entra nell'app, non fa nessun navigate, non lancia il sessionCheck
  it('senza spid token - ingresso anonimo', async () => {
    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText("Generic Page");
    expect(pageComponent).toBeTruthy();

    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });

  // cosa si aspetta: entra nell'app, fa navigate verso notifiche, lancia il sessionCheck
  it('utente riconosciuto - TOS già accettate', async () => {
    mockLocationHash = "#token=good_token";

    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText("Generic Page");
    expect(pageComponent).toBeTruthy();

    expect(mockNavigateFn).toBeCalledTimes(1);
    expect((mockNavigateFn.mock.calls[0] as any)[0]).toBe(routes.NOTIFICHE);
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  // cosa si aspetta: entra nell'app, fa navigate verso TOS, lancia il sessionCheck
  it('utente riconosciuto - TOS non ancora accettate', async () => {
    mockLocationHash = "#token=good_token";
    mockTosValue = false;

    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const pageComponent = screen.queryByText("Generic Page");
    expect(pageComponent).toBeTruthy();

    expect(mockNavigateFn).toBeCalledTimes(1);
    expect((mockNavigateFn.mock.calls[0] as any)[0]).toBe(routes.TOS);
    expect(mockSessionCheckFn).toBeCalledTimes(1);
  });

  // cosa si aspetta: non entra nell'app, messaggio associato al diservizio della chiamata 
  it('utente riconosciuto - fallisce la chiamata a TOS', async () => {
    mockLocationHash = "#token=good_token";
    mockMakeTosCallFail = true;

    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    screen.debug();
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText("leaving-app.title");
    expect(logoutTitleComponent).toBeNull();
    const tosCallFailedComponent = screen.queryByText("error-when-fetching-tos-status.title");
    expect(tosCallFailedComponent).toBeTruthy();

    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });

  // cosa si aspetta: non entra nell'app, messaggio associato all'errore di exchangeToken
  it('errore nello SPID token', async () => {
    mockLocationHash = "#token=bad_token";

    await act(async () => void render(<SessionGuardWithErrorPublisher />));
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText("leaving-app.title");
    expect(logoutTitleComponent).toBeNull();

    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });

  // cosa si aspetta: non entra nell'app, messaggio di logout
  it('logout', async () => {
    const mockReduxState = {
      userState: { user: { sessionToken: 'mocked-token' }, isClosedSession: true },
    };

    await act(async () => void render(<SessionGuardWithErrorPublisher />, { preloadedState: mockReduxState }));
    const logoutComponent = screen.queryByText('Session Modal');
    expect(logoutComponent).toBeTruthy();
    const logoutTitleComponent = screen.queryByText("leaving-app.title");
    expect(logoutTitleComponent).toBeTruthy();

    expect(mockNavigateFn).toBeCalledTimes(0);
    expect(mockSessionCheckFn).toBeCalledTimes(0);
  });
});
