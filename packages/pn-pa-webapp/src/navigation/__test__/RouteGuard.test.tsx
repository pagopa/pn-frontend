import { Route, Routes } from 'react-router-dom';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen } from '../../__test__/test-utils';
import { PNRole } from '../../models/user';
import RouteGuard from '../RouteGuard';

const mockReduxState = {
  userState: {
    user: userResponse,
  },
};

const Guard = ({ roles }: { roles: Array<PNRole> | null }) => (
  <Routes>
    <Route path="/" element={<RouteGuard roles={roles} />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('RouteGuard component', () => {
  it('Logged user - route without required roles', async () => {
    await act(async () => {
      render(<Guard roles={null} />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it('Logged user - the user roles match the required ones', async () => {
    await act(async () => {
      render(<Guard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />, {
        preloadedState: mockReduxState,
      });
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it("Logged user - the user roles don't match the required ones", async () => {
    await act(async () => {
      render(<Guard roles={[PNRole.OPERATOR]} />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeNull();
    expect(accessDeniedComponent).toBeTruthy();
  });
});
