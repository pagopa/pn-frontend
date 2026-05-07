import { Route, Routes } from 'react-router-dom';

import { userResponse } from '../../__mocks__/Auth.mock';
import { RenderResult, act, render, screen } from '../../__test__/test-utils';
import RouteGuard from '../RouteGuard';
import { DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM } from '../routes.const';

const mockReduxState = {
  userState: {
    user: userResponse,
  },
};

const Guard = () => (
  <Routes>
    <Route element={<RouteGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('RouteGuard component', () => {
  let result: RenderResult;

  it('Logged user', async () => {
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it('Get aar from localStorage', async () => {
    const mockQrCode = 'qr-code';
    localStorage.setItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM, mockQrCode);

    await act(async () => {
      result = render(<Guard />, { preloadedState: mockReduxState });
    });

    expect(result.router.state.location.pathname).toBe('/');
    expect(result.router.state.location.search).toBe('?aar=' + mockQrCode);
    expect(result.router.state.historyAction).toBe('REPLACE');

    expect(localStorage.getItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM)).toBeNull();
  });
});
