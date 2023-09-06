import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen } from '../../__test__/test-utils';
import RouteGuard from '../RouteGuard';

const mockReduxState = {
  userState: {
    user: userResponse,
  },
};

const Guard = () => (
  <Routes>
    <Route path="/" element={<RouteGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('RouteGuard component', () => {
  it('Logged user', async () => {
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it('No user logged', async () => {
    await act(async () => {
      render(<Guard />);
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeNull();
    expect(accessDeniedComponent).toBeTruthy();
  });
});
