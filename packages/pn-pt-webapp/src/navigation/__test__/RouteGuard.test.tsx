import { Route, Routes } from 'react-router-dom';

import { operatorUserResponse, userResponse } from '../../__mocks__/Auth.mock';
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
    expect(screen.queryByText('Generic Page')).toBeInTheDocument();
    expect(screen.queryByTestId('access-denied')).not.toBeInTheDocument();
  });

  it('Logged user - the user roles match the required ones', async () => {
    await act(async () => {
      render(<Guard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />, {
        preloadedState: mockReduxState,
      });
    });
    expect(screen.queryByText('Generic Page')).toBeInTheDocument();
    expect(screen.queryByTestId('access-denied')).not.toBeInTheDocument();
  });

  it("Logged user - the user roles don't match the required ones", async () => {
    await act(async () => {
      render(<Guard roles={[PNRole.ADMIN]} />, {
        preloadedState: { userState: { user: operatorUserResponse } },
      });
    });
    expect(screen.queryByText('Generic Page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('access-denied')).toBeInTheDocument();
  });
});
