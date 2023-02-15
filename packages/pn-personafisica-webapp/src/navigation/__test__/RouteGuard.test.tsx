import React from 'react';
import { act, screen } from '@testing-library/react';
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

describe('RouteGuard component', () => {
  it('Logged user', async () => {
    const mockReduxState = {
      userState: { user: { sessionToken: 'mocked-token' }, tos: true },
    };

    await act(async () => void render(<RouteGuard />, { preloadedState: mockReduxState }));
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByText('Access Denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it('No user logged', async () => {
    await act(async () => void render(<RouteGuard />));
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByText('Access Denied');
    const deniedLogged = screen.queryByText('sì è loggato');
    const deniedNotLogged = screen.queryByText('non è loggato');
    expect(pageComponent).toBeNull();
    expect(accessDeniedComponent).toBeTruthy();
    expect(deniedLogged).toBeNull();
    expect(deniedNotLogged).toBeTruthy();
  });
});
