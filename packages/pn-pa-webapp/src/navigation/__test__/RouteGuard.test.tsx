import { act, screen } from '@testing-library/react';
import { PNRole } from '../../models/user';
import { render } from '../../__test__/test-utils';
import RouteGuard from '../RouteGuard';

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
  };
});

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    AccessDenied: ({ isLogged }: { isLogged: boolean }) => (
      <>
        <div>Access Denied</div>
        <div>{isLogged ? 'sì è loggato' : 'non è loggato'}</div>
      </>
    ),
  };
});

const mockReduxState = {
  userState: {
    user: { sessionToken: 'mocked-token', organization: { roles: [{ role: PNRole.OPERATOR }] } },
  },
};

describe('RouteGuard component', () => {
  it('No user logged', async () => {
    await act(async () => void render(<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />));
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByText('Access Denied');
    const deniedLogged = screen.queryByText('sì è loggato');
    const deniedNotLogged = screen.queryByText('non è loggato');
    expect(pageComponent).toBeNull();
    expect(accessDeniedComponent).toBeTruthy();
    expect(deniedLogged).toBeNull();
    expect(deniedNotLogged).toBeTruthy();
  });

  it('Logged user - route che non richiede di ruoli', async () => {
    await act(
      async () => void render(<RouteGuard roles={null} />, { preloadedState: mockReduxState })
    );
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByText('Access Denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it("Logged user - l'utente ha un ruolo accettato", async () => {
    await act(
      async () =>
        void render(<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />, {
          preloadedState: mockReduxState,
        })
    );
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByText('Access Denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it("Logged user - l'utente non ha un ruolo accettato", async () => {
    await act(
      async () =>
        void render(<RouteGuard roles={[PNRole.ADMIN]} />, { preloadedState: mockReduxState })
    );
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByText('Access Denied');
    const deniedLogged = screen.queryByText('sì è loggato');
    const deniedNotLogged = screen.queryByText('non è loggato');
    expect(pageComponent).toBeNull();
    expect(accessDeniedComponent).toBeTruthy();
    expect(deniedLogged).toBeTruthy();
    expect(deniedNotLogged).toBeNull();
  });
});
